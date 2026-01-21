import { db } from "@db";
import { type Lead, type InsertLead, leads } from "@shared/schema";

export interface IStorage {
  createLead(lead: InsertLead): Promise<Lead>;
  getAllLeads(): Promise<Lead[]>;
}

export class DatabaseStorage implements IStorage {
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return await db.select().from(leads).orderBy(leads.createdAt);
  }
}

export const storage = new DatabaseStorage();
