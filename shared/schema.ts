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
  // Step 2: Need
  siteType: text("site_type").notNull(),
  pages: text("pages").notNull(),
  // Step 3: Languages
  languages: text("languages").notNull(),
  // Step 4: Domain
  domain: text("domain").notNull(),
  emailPro: text("email_pro").notNull(),
  // Step 5: Timing
  timing: text("timing").notNull(),
  // Step 6: Contact
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
