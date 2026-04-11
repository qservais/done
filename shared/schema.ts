import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  businessName: text("business_name"),
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
  lastname: text("lastname"),
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
  businessName: text("business_name"),
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
  lastname: text("lastname"),
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

export const briefs = pgTable("briefs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  activity: text("activity").notNull(),
  activityDescription: text("activity_description"),
  services: text("services"),
  differentiator: text("differentiator"),
  visitorActions: text("visitor_actions"),
  socialInstagram: text("social_instagram"),
  socialFacebook: text("social_facebook"),
  socialGoogle: text("social_google"),
  socialTiktok: text("social_tiktok"),
  socialLinkedin: text("social_linkedin"),
  languages: text("languages"),
  objectives: text("objectives"),
  sitePhone: text("site_phone"),
  siteEmail: text("site_email"),
  siteAddress: text("site_address"),
  siteHours: text("site_hours"),
  hasPhotos: boolean("has_photos"),
  module: text("module"),
  firstname: text("firstname").notNull(),
  lastname: text("lastname"),
  email: text("email").notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBriefSchema = createInsertSchema(briefs).omit({
  id: true,
  createdAt: true,
});

export type InsertBrief = z.infer<typeof insertBriefSchema>;
export type Brief = typeof briefs.$inferSelect;
