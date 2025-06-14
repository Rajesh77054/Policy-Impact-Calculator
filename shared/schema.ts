import { pgTable, text, serial, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User sessions for temporary data storage
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  formData: json("form_data").$type<FormData>(),
  results: json("results").$type<PolicyResults>(),
  createdAt: integer("created_at").notNull(),
});

// Form data structure
export const formDataSchema = z.object({
  // Step 1: Location
  state: z.string().optional(),
  zipCode: z.string().optional(),
  
  // Step 2: Demographics
  ageRange: z.enum(["18-29", "30-44", "45-64", "65+"]).optional(),
  familyStatus: z.enum(["single", "married", "family"]).optional(),
  
  // Step 3: Employment
  employmentStatus: z.enum(["full-time", "part-time", "self-employed", "contract", "unemployed", "retired", "student", "unable"]).optional(),
  industry: z.string().optional(),
  
  // Step 4: Healthcare
  insuranceType: z.enum(["employer", "marketplace", "medicare", "medicaid", "military", "uninsured"]).optional(),
  
  // Step 5: Income
  incomeRange: z.enum(["under-25k", "25k-50k", "50k-75k", "75k-100k", "100k-150k", "over-150k"]).optional(),
  
  // Step 6: Priorities
  priorities: z.array(z.string()).optional(),
});

export const policyResultsSchema = z.object({
  annualTaxImpact: z.number(),
  healthcareCostImpact: z.number(),
  energyCostImpact: z.number(),
  netAnnualImpact: z.number(),
  healthcareCosts: z.object({
    current: z.number(),
    proposed: z.number(),
  }),
  communityImpact: z.object({
    schoolFunding: z.number(),
    infrastructure: z.number(),
    jobOpportunities: z.number(),
  }),
  timeline: z.object({
    fiveYear: z.number(),
    tenYear: z.number(),
    twentyYear: z.number(),
  }),
  breakdown: z.array(z.object({
    category: z.string(),
    title: z.string(),
    description: z.string(),
    impact: z.number(),
    details: z.array(z.object({
      item: z.string(),
      amount: z.number(),
    })),
  })),
});

export const insertSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export type FormData = z.infer<typeof formDataSchema>;
export type PolicyResults = z.infer<typeof policyResultsSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;
