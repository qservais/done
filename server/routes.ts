import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // TODO: Send email notification to studio (can be added later with nodemailer)
      
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

  // Get all leads (for internal admin use - would need auth in production)
  app.get("/api/leads", async (req, res) => {
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

  return httpServer;
}
