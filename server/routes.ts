import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { sendConfirmationEmail, sendNotificationEmail } from "./email";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const { companyWebsite, siteInspi, objectif, ...leadPayload } = req.body;
      
      // Add optional fields to payload
      const fullLeadPayload = {
        ...leadPayload,
        siteInspi: siteInspi || null,
        objectif: objectif || null,
      };
      
      // Honeypot check: if filled, silently return success (bot detected)
      if (companyWebsite && companyWebsite.trim() !== "") {
        console.log("Honeypot triggered - spam blocked");
        return res.status(201).json({ 
          success: true, 
          message: "Lead créé avec succès" 
        });
      }
      
      const leadData = insertLeadSchema.parse(fullLeadPayload);
      const lead = await storage.createLead(leadData);
      
      // Send emails in parallel (don't block response)
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

  // Get all leads (protected with basic auth)
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
  
  // Verify admin password
  app.post("/api/admin/verify", async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "done2024";
    
    if (password === adminPassword) {
      res.json({ success: true, token: adminPassword });
    } else {
      res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }
  });

  return httpServer;
}
