import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertPartialLeadSchema } from "@shared/schema";
import { sendConfirmationEmail, sendNotificationEmail } from "./email";
import { z } from "zod";

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
      ]).catch((err) => {
        console.error("Error sending emails:", err);
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

  return httpServer;
}
