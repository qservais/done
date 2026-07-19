import { db } from "@db";
import { eq, desc, asc, and, count, sum, sql } from "drizzle-orm";
import { type Lead, type InsertLead, leads, type PartialLead, type InsertPartialLead, partialLeads, type Brief, type InsertBrief, briefs, type SeoPage, type InsertSeoPage, seoPages, type GenerationLog, type InsertGenerationLog, generationLogs } from "@shared/schema";

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
  createSeoPageLock(data: { slug: string; title: string; category: string }): Promise<SeoPage | null>;
  updateSeoPageBySlug(slug: string, data: Partial<InsertSeoPage>): Promise<void>;
  deleteSeoPageBySlug(slug: string): Promise<void>;
  getAllSeoPageSlugs(): Promise<string[]>;
  getOldestPublishedSeoPage(): Promise<SeoPage | null>;
  getPublishedSeoPagesList(): Promise<Pick<SeoPage, "slug" | "title" | "metaDescription" | "category" | "readTime" | "tags" | "date" | "updatedAt">[]>;
  getPublishedSeoPageTitles(): Promise<Pick<SeoPage, "slug" | "title">[]>;
  getPublishedSeoPageBySlug(slug: string): Promise<SeoPage | null>;
  createGenerationLog(log: InsertGenerationLog): Promise<void>;
  getGenerationStats(): Promise<{ totalSuccess: number; totalCostUsd: string | null }>;
  getLastGenerationLog(): Promise<GenerationLog | null>;
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

  async createSeoPageLock(data: { slug: string; title: string; category: string }): Promise<SeoPage | null> {
    try {
      const [page] = await db.insert(seoPages).values({
        slug: data.slug,
        title: data.title,
        category: data.category,
        status: "generating",
      }).returning();
      return page;
    } catch {
      return null;
    }
  }

  async updateSeoPageBySlug(slug: string, data: Partial<InsertSeoPage>): Promise<void> {
    await db.update(seoPages).set(data).where(eq(seoPages.slug, slug));
  }

  async deleteSeoPageBySlug(slug: string): Promise<void> {
    await db.delete(seoPages).where(eq(seoPages.slug, slug));
  }

  async getAllSeoPageSlugs(): Promise<string[]> {
    const rows = await db.select({ slug: seoPages.slug }).from(seoPages);
    return rows.map((r) => r.slug);
  }

  async getOldestPublishedSeoPage(): Promise<SeoPage | null> {
    const [page] = await db.select().from(seoPages)
      .where(eq(seoPages.status, "published"))
      .orderBy(asc(seoPages.lastReviewedAt))
      .limit(1);
    return page || null;
  }

  async getPublishedSeoPagesList() {
    return await db.select({
      slug: seoPages.slug,
      title: seoPages.title,
      metaDescription: seoPages.metaDescription,
      category: seoPages.category,
      readTime: seoPages.readTime,
      tags: seoPages.tags,
      date: seoPages.date,
      updatedAt: seoPages.updatedAt,
    })
      .from(seoPages)
      .where(eq(seoPages.status, "published"))
      .orderBy(desc(seoPages.date));
  }

  async getPublishedSeoPageTitles() {
    return await db.select({ slug: seoPages.slug, title: seoPages.title })
      .from(seoPages)
      .where(eq(seoPages.status, "published"));
  }

  async getPublishedSeoPageBySlug(slug: string): Promise<SeoPage | null> {
    const [page] = await db.select().from(seoPages)
      .where(and(eq(seoPages.slug, slug), eq(seoPages.status, "published")))
      .limit(1);
    return page || null;
  }

  async createGenerationLog(log: InsertGenerationLog): Promise<void> {
    await db.insert(generationLogs).values(log);
  }

  async getGenerationStats(): Promise<{ totalSuccess: number; totalCostUsd: string | null }> {
    const [stats] = await db.select({
      totalSuccess: count(),
      totalCostUsd: sum(generationLogs.costUsd),
    }).from(generationLogs).where(eq(generationLogs.status, "success"));
    return {
      totalSuccess: stats?.totalSuccess ?? 0,
      totalCostUsd: stats?.totalCostUsd ?? null,
    };
  }

  async getLastGenerationLog(): Promise<GenerationLog | null> {
    const [log] = await db.select().from(generationLogs)
      .orderBy(desc(generationLogs.createdAt))
      .limit(1);
    return log || null;
  }
}

export const storage = new DatabaseStorage();
