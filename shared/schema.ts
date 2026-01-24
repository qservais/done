import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
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
