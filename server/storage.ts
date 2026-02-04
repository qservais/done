import { db } from "@db";
import { eq, desc, and, sql } from "drizzle-orm";
import { type Lead, type InsertLead, leads, type PartialLead, type InsertPartialLead, partialLeads } from "@shared/schema";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  upsertPartialLead(sessionId: string, data: Partial<InsertPartialLead>): Promise<PartialLead>;
  getPartialLead(sessionId: string): Promise<PartialLead | null>;
  markPartialLeadConverted(sessionId: string): Promise<void>;
  getAllPartialLeads(): Promise<PartialLead[]>;
  getUnconvertedPartialLeads(): Promise<PartialLead[]>;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async upsertPartialLead(sessionId: string, data: Partial<InsertPartialLead>): Promise<PartialLead> {
    const existing = await this.getPartialLead(sessionId);
    
    if (existing) {
      const newMaxStep = Math.max(existing.maxStepReached, data.currentStep || 1);
      const [updated] = await db
        .update(partialLeads)
        .set({
          ...data,
          maxStepReached: newMaxStep,
          updatedAt: new Date(),
        })
        .where(eq(partialLeads.sessionId, sessionId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(partialLeads)
        .values({
          sessionId,
          currentStep: 1,
          maxStepReached: 1,
          ...data,
        })
        .returning();
      return created;
    }
  }

  async getPartialLead(sessionId: string): Promise<PartialLead | null> {
    const [result] = await db
      .select()
      .from(partialLeads)
      .where(eq(partialLeads.sessionId, sessionId));
    return result || null;
  }

  async markPartialLeadConverted(sessionId: string): Promise<void> {
    await db
      .update(partialLeads)
      .set({ converted: true, updatedAt: new Date() })
      .where(eq(partialLeads.sessionId, sessionId));
  }

  async getAllPartialLeads(): Promise<PartialLead[]> {
    return await db.select().from(partialLeads).orderBy(desc(partialLeads.updatedAt));
  }

  async getUnconvertedPartialLeads(): Promise<PartialLead[]> {
    return await db
      .select()
      .from(partialLeads)
      .where(eq(partialLeads.converted, false))
      .orderBy(desc(partialLeads.updatedAt));
  }
}

export const storage = new DatabaseStorage();
