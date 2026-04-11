import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPartialLeadSchema, insertBriefSchema } from "@shared/schema";
import { sendConfirmationEmail, sendNotificationEmail } from "./email";
import { sendBriefNotification } from "./email-brief";
import { pushLeadToHubSpot } from "./hubspot";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const aiRateLimiter = new Map<string, { count: number; resetAt: number }>();
const AI_RATE_LIMIT = 5;
const AI_RATE_WINDOW_MS = 60 * 1000;

function checkAiRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = aiRateLimiter.get(ip);
  if (!entry || now > entry.resetAt) {
    aiRateLimiter.set(ip, { count: 1, resetAt: now + AI_RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= AI_RATE_LIMIT) return false;
  entry.count += 1;
  return true;
}

function safeParseJsonArray(val: string | null | undefined): string | null {
  if (!val) return null;
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr)) return arr.join(", ");
    return val;
  } catch {
    return val;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/leads", async (req, res) => {
    try {
      const { siteInspi, objectifs, ...leadPayload } = req.body;
      
      const fullLeadPayload = {
        ...leadPayload,
        siteInspi: siteInspi || null,
        objectifs: objectifs || null,
      };
      
      const leadData = insertLeadSchema.parse(fullLeadPayload);
      const lead = await storage.createLead(leadData);
      
      Promise.all([
        sendConfirmationEmail(fullLeadPayload),
        sendNotificationEmail(fullLeadPayload),
        pushLeadToHubSpot({
          firstname: fullLeadPayload.name,
          lastname: fullLeadPayload.lastname || null,
          email: fullLeadPayload.email || null,
          phone: fullLeadPayload.phone || null,
          company: fullLeadPayload.businessName || null,
          activity: fullLeadPayload.activity,
          zone: fullLeadPayload.zone,
          pages: fullLeadPayload.pages || null,
          languages: fullLeadPayload.languages || null,
          domain: fullLeadPayload.domain || null,
          timing: fullLeadPayload.timing || null,
          message: fullLeadPayload.message || null,
        }),
      ]).catch((err) => {
        console.error("Error sending emails/HubSpot:", err);
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Lead créé avec succès",
        leadId: lead.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erreur serveur" 
        });
      }
    }
  });

  app.get("/api/leads", async (req, res) => {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD || "done2024";
    
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ 
        success: false, 
        message: "Non autorisé" 
      });
    }
    
    try {
      const allLeads = await storage.getAllLeads();
      res.json({ success: true, leads: allLeads });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
      });
    }
  });
  
  app.post("/api/admin/verify", async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "done2024";
    
    if (password === adminPassword) {
      res.json({ success: true, token: adminPassword });
    } else {
      res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }
  });

  app.post("/api/partial-leads", async (req, res) => {
    try {
      const { sessionId, ...data } = req.body;
      
      if (!sessionId) {
        return res.status(400).json({ 
          success: false, 
          message: "Session ID requis" 
        });
      }
      
      const validatedData = insertPartialLeadSchema.parse({
        sessionId,
        ...data,
      });
      
      const partialLead = await storage.upsertPartialLead(sessionId, validatedData);
      res.json({ success: true, partialLead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: "Données invalides", 
          errors: error.errors 
        });
      }
      console.error("Error saving partial lead:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
      });
    }
  });

  app.post("/api/partial-leads/:sessionId/convert", async (req, res) => {
    try {
      const { sessionId } = req.params;
      await storage.markPartialLeadConverted(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking partial lead converted:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
      });
    }
  });

  app.get("/api/partial-leads", async (req, res) => {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD || "done2024";
    
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({ 
        success: false, 
        message: "Non autorisé" 
      });
    }
    
    try {
      const unconvertedOnly = req.query.unconverted === "true";
      const partialLeads = unconvertedOnly 
        ? await storage.getUnconvertedPartialLeads()
        : await storage.getAllPartialLeads();
      res.json({ success: true, partialLeads });
    } catch (error) {
      console.error("Error fetching partial leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erreur serveur" 
      });
    }
  });

  app.post("/api/briefs/generate-description", async (req, res) => {
    try {
      const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown";
      if (!checkAiRateLimit(ip)) {
        return res.status(429).json({
          success: false,
          message: "Trop de requêtes. Veuillez réessayer dans une minute.",
        });
      }

      const { businessName, activity } = req.body;
      
      if (!businessName || typeof businessName !== "string" || businessName.trim().length === 0 ||
          !activity || typeof activity !== "string" || activity.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "businessName et activity sont requis",
        });
      }

      const safeBusinessName = businessName.trim().slice(0, 200);
      const safeActivity = activity.trim().slice(0, 200);

      if (!process.env.ANTHROPIC_API_KEY) {
        return res.status(503).json({
          success: false,
          message: "Service IA non disponible",
        });
      }

      const message = await anthropic.messages.create({
        model: "claude-opus-4-5",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Génère une description professionnelle en français pour le site web de "${safeBusinessName}", une entreprise spécialisée en "${safeActivity}". 

La description doit :
- Faire 2 à 3 phrases maximum
- Être rédigée à la troisième personne (parler de l'entreprise, pas de "nous")
- Mettre en valeur le sérieux, l'expertise et la valeur ajoutée
- Être naturelle et engageante, pas trop corporate
- Ne pas mentionner de prix

Réponds uniquement avec la description, sans introduction ni commentaire.`,
          },
        ],
      });

      const description = message.content[0].type === "text" 
        ? message.content[0].text.trim()
        : "";

      res.json({ success: true, description });
    } catch (error) {
      console.error("Claude API error:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la génération",
      });
    }
  });

  app.post("/api/briefs", async (req, res) => {
    try {
      const briefData = insertBriefSchema.parse(req.body);
      const brief = await storage.createBrief(briefData);

      Promise.all([
        sendBriefNotification(briefData),
        pushLeadToHubSpot({
          firstname: briefData.firstname,
          lastname: briefData.lastname || null,
          email: briefData.email,
          phone: briefData.phone || null,
          company: briefData.companyName,
          activity: briefData.activity,
          zone: null,
          pages: null,
          languages: safeParseJsonArray(briefData.languages),
          domain: null,
          timing: null,
          message: [
            briefData.activityDescription ? `Description: ${briefData.activityDescription}` : null,
            briefData.differentiator ? `Différenciation: ${briefData.differentiator}` : null,
            briefData.objectives ? `Objectifs: ${safeParseJsonArray(briefData.objectives)}` : null,
            briefData.module ? `Module: ${briefData.module}` : null,
          ].filter(Boolean).join(" | ") || null,
        }),
      ]).catch((err) => {
        console.error("Error sending brief emails/HubSpot:", err);
      });

      res.status(201).json({
        success: true,
        message: "Brief soumis avec succès",
        briefId: brief.id,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Données invalides",
          errors: error.errors,
        });
      } else {
        console.error("Error creating brief:", error);
        res.status(500).json({
          success: false,
          message: "Erreur serveur",
        });
      }
    }
  });

  app.get("/api/briefs", async (req, res) => {
    const authHeader = req.headers.authorization;
    const adminPassword = process.env.ADMIN_PASSWORD || "done2024";

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return res.status(401).json({
        success: false,
        message: "Non autorisé",
      });
    }

    try {
      const allBriefs = await storage.getAllBriefs();
      res.json({ success: true, briefs: allBriefs });
    } catch (error) {
      console.error("Error fetching briefs:", error);
      res.status(500).json({
        success: false,
        message: "Erreur serveur",
      });
    }
  });

  return httpServer;
}
