import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User sessions for temporary data storage
export const userSessions = pgTable("user_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  formData: json("form_data").$type<FormData>(),
  results: json("results").$type<PolicyResults>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Form data structure
export const formDataSchema = z.object({
  // Step 1: Location
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // Step 2: Demographics - Aligned with IRS filing status and healthcare categories
  ageRange: z.enum(["18-29", "30-44", "45-64", "65+"]).optional(),
  familyStatus: z.enum(["single", "married-joint", "married-separate", "head-of-household"]).optional(),
  hasChildren: z.boolean().optional(),
  numberOfQualifyingChildren: z.number().min(0).max(10).optional(), // IRS qualifying children under 17
  numberOfOtherDependents: z.number().min(0).max(10).optional(), // IRS other dependents (17+, elderly parents, etc.)

  // Step 3: Employment
  employmentStatus: z.enum(["full-time", "part-time", "self-employed", "contract", "unemployed", "retired", "student", "unable"]).optional(),
  industry: z.string().optional(),

  // Step 4: Healthcare
  insuranceType: z.enum(["employer", "marketplace", "medicare", "medicaid", "military", "uninsured"]).optional(),
  hasHSA: z.boolean().optional(),
  // Step 5: Income - Aligned with IRS tax brackets for accurate calculations
  incomeRange: z.enum(["under-15k", "15k-45k", "45k-95k", "95k-200k", "200k-400k", "over-400k"]).optional(),

  // Step 6: Priorities
  priorities: z.array(z.string()).optional(),
  includeBigBill: z.boolean().optional(),
});

const policyBreakdownSchema = z.object({
  category: z.string(),
  title: z.string(),
  description: z.string(),
  impact: z.number(),
  details: z.array(z.object({
    item: z.string(),
    amount: z.number(),
  })),
});

export const policyResultsSchema = z.object({
  annualTaxImpact: z.number(),
  healthcareCostImpact: z.number(),
  energyCostImpact: z.number(),
  netAnnualImpact: z.number(),
  deficitImpact: z.number(),
  recessionProbability: z.number(),
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
  breakdown: z.array(policyBreakdownSchema),
  bigBillScenario: z.object({
    annualTaxImpact: z.number(),
    healthcareCostImpact: z.number(),
    energyCostImpact: z.number(),
    netAnnualImpact: z.number(),
    deficitImpact: z.number(),
    recessionProbability: z.number(),
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
    breakdown: z.array(policyBreakdownSchema),
  }),
});

export const insertSessionSchema = createInsertSchema(userSessions).omit({
  id: true,
  createdAt: true,
});

export type FormData = z.infer<typeof formDataSchema>;
export type PolicyResults = z.infer<typeof policyResultsSchema>;

export const replitUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  profileImage: z.string(),
  bio: z.string(),
  url: z.string(),
  roles: z.array(z.string()),
  teams: z.array(z.string())
});

export type ReplitUser = z.infer<typeof replitUserSchema>;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type UserSession = typeof userSessions.$inferSelect;