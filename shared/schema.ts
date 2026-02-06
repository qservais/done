import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  activity: text("activity").notNull(),
  zone: text("zone").notNull(),
  siteType: text("site_type").notNull(),
  pack: text("pack"),
  packPrice: text("pack_price"),
  pages: text("pages"),
  languages: text("languages"),
  domain: text("domain"),
  emailPro: text("email_pro"),
  siteInspi: text("site_inspi"),
  objectifs: text("objectifs"),
  timing: text("timing"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const partialLeads = pgTable("partial_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull().unique(),
  currentStep: integer("current_step").notNull().default(1),
  maxStepReached: integer("max_step_reached").notNull().default(1),
  siteStatus: text("site_status"),
  objectifs: text("objectifs"),
  activity: text("activity"),
  zone: text("zone"),
  pack: text("pack"),
  packPrice: text("pack_price"),
  pages: text("pages"),
  languages: text("languages"),
  domain: text("domain"),
  emailPro: text("email_pro"),
  siteInspi: text("site_inspi"),
  timing: text("timing"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message"),
  converted: boolean("converted").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertPartialLeadSchema = createInsertSchema(partialLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPartialLead = z.infer<typeof insertPartialLeadSchema>;
export type PartialLead = typeof partialLeads.$inferSelect;
