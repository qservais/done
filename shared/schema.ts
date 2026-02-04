import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Lead qualification data from the multi-step form
export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Step 1: Activity
  activity: text("activity").notNull(),
  zone: text("zone").notNull(),
  // Step 2: Pack selection
  siteType: text("site_type").notNull(),
  pack: text("pack"),
  packPrice: text("pack_price"),
  pages: text("pages").notNull(),
  // Step 3: Options
  languages: text("languages").notNull(),
  domain: text("domain").notNull(),
  emailPro: text("email_pro").notNull(),
  siteInspi: text("site_inspi"),
  objectifs: text("objectifs"),
  // Step 4: Timing
  timing: text("timing").notNull(),
  // Step 5: Contact
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  // System fields
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Partial leads for tracking form abandonment
export const partialLeads = pgTable("partial_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  currentStep: integer("current_step").notNull().default(1),
  maxStepReached: integer("max_step_reached").notNull().default(1),
  // Form data (all optional as they might not be filled yet)
  siteStatus: text("site_status"),
  objectifs: text("objectifs"),
  activity: text("activity"),
  zone: text("zone"),
  pack: text("pack"),
  packPrice: text("pack_price"),
  languages: text("languages"),
  domain: text("domain"),
  emailPro: text("email_pro"),
  siteInspi: text("site_inspi"),
  timing: text("timing"),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  message: text("message"),
  // Status
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
