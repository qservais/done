import { db } from "@db";
import { eq, desc, sql } from "drizzle-orm";
import { type Lead, type InsertLead, leads, type PartialLead, type InsertPartialLead, partialLeads, type Brief, type InsertBrief, briefs } from "@shared/schema";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
  upsertPartialLead(sessionId: string, data: Partial<InsertPartialLead>): Promise<PartialLead>;
  getPartialLead(sessionId: string): Promise<PartialLead | null>;
  markPartialLeadConverted(sessionId: string): Promise<void>;
  getAllPartialLeads(): Promise<PartialLead[]>;
  getUnconvertedPartialLeads(): Promise<PartialLead[]>;
  createBrief(brief: InsertBrief): Promise<Brief>;
  getAllBriefs(): Promise<Brief[]>;
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
    const currentStep = data.currentStep || 1;
    
    const [result] = await db
      .insert(partialLeads)
      .values({
        sessionId,
        currentStep,
        maxStepReached: currentStep,
        ...data,
      })
      .onConflictDoUpdate({
        target: [partialLeads.sessionId],
        set: {
          ...data,
          maxStepReached: sql`GREATEST(${partialLeads.maxStepReached}, ${currentStep})`,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    return result;
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

  async createBrief(insertBrief: InsertBrief): Promise<Brief> {
    const [brief] = await db.insert(briefs).values(insertBrief).returning();
    return brief;
  }

  async getAllBriefs(): Promise<Brief[]> {
    return await db.select().from(briefs).orderBy(desc(briefs.createdAt));
  }
}

export const storage = new DatabaseStorage();
