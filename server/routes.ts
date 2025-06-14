import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { formDataSchema, policyResultsSchema } from "@shared/schema";
import { generateSessionId, calculatePolicyImpact } from "./utils/policy-calculator";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'policy-calculator-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Create new session
  app.post("/api/session", async (req, res) => {
    try {
      const sessionId = generateSessionId();
      const session = await storage.createSession(sessionId);
      
      req.session.policySessionId = sessionId;
      
      res.json({ sessionId });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get current session
  app.get("/api/session", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      res.json(session);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update form data
  app.post("/api/session/form-data", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const validatedData = formDataSchema.parse(req.body);
      const session = await storage.updateSessionFormData(sessionId, validatedData);
      
      res.json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Calculate policy impact
  app.post("/api/calculate", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session || !session.formData) {
        return res.status(400).json({ message: "Form data not found" });
      }

      const results = calculatePolicyImpact(session.formData);
      const updatedSession = await storage.updateSessionResults(sessionId, results);
      
      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get results
  app.get("/api/results", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session || !session.results) {
        return res.status(404).json({ message: "Results not found" });
      }

      res.json(session.results);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

function calculatePolicyImpact(formData: any): any {
  // Policy impact calculation logic
  const baseValues = {
    taxImpact: 0,
    healthcareImpact: 0,
    energyImpact: 0,
  };

  // Tax calculations based on income and family status
  if (formData.incomeRange && formData.familyStatus) {
    const incomeMultipliers = {
      "under-25k": 0.5,
      "25k-50k": 0.8,
      "50k-75k": 1.0,
      "75k-100k": 1.3,
      "100k-150k": 1.6,
      "over-150k": 2.0,
    };
    
    const familyMultipliers = {
      "single": 1.0,
      "married": 1.4,
      "family": 1.8,
    };

    baseValues.taxImpact = 1240 * 
      (incomeMultipliers[formData.incomeRange as keyof typeof incomeMultipliers] || 1.0) *
      (familyMultipliers[formData.familyStatus as keyof typeof familyMultipliers] || 1.0);
  }

  // Healthcare calculations
  if (formData.insuranceType && formData.ageRange) {
    const insuranceImpacts = {
      "employer": -300,
      "marketplace": -500,
      "medicare": -200,
      "medicaid": -100,
      "uninsured": -800,
    };

    const ageMultipliers = {
      "18-29": 0.7,
      "30-44": 1.0,
      "45-64": 1.3,
      "65+": 1.1,
    };

    baseValues.healthcareImpact = 
      (insuranceImpacts[formData.insuranceType as keyof typeof insuranceImpacts] || -480) *
      (ageMultipliers[formData.ageRange as keyof typeof ageMultipliers] || 1.0);
  }

  // Energy calculations based on state
  if (formData.state) {
    const stateEnergyImpacts = {
      "CA": 150,
      "TX": 80,
      "FL": 90,
      "NY": 140,
      "AL": 70,
    };
    baseValues.energyImpact = stateEnergyImpacts[formData.state as keyof typeof stateEnergyImpacts] || 120;
  }

  const netAnnual = baseValues.taxImpact + baseValues.healthcareImpact + baseValues.energyImpact;

  return {
    annualTaxImpact: Math.round(baseValues.taxImpact),
    healthcareCostImpact: Math.round(baseValues.healthcareImpact),
    energyCostImpact: Math.round(baseValues.energyImpact),
    netAnnualImpact: Math.round(netAnnual),
    communityImpact: {
      schoolFunding: 12,
      infrastructure: 2100000,
      jobOpportunities: 340,
    },
    timeline: {
      fiveYear: Math.round(netAnnual * 5 * 1.1),
      tenYear: Math.round(netAnnual * 10 * 1.15),
      twentyYear: Math.round(netAnnual * 20 * 1.2),
    },
    breakdown: [
      {
        category: "tax",
        title: "Tax Policy Changes",
        description: "Proposed adjustments to federal tax brackets and deductions",
        impact: Math.round(baseValues.taxImpact),
        details: [
          { item: "Standard deduction increase", amount: Math.round(baseValues.taxImpact * 0.55) },
          { item: "Tax bracket adjustment", amount: Math.round(baseValues.taxImpact * 0.45) },
        ],
      },
      {
        category: "healthcare",
        title: "Healthcare Policy",
        description: "Changes to insurance regulations and prescription drug costs",
        impact: Math.round(baseValues.healthcareImpact),
        details: [
          { item: "Prescription drug costs", amount: Math.round(baseValues.healthcareImpact * 0.6) },
          { item: "Insurance premium impact", amount: Math.round(baseValues.healthcareImpact * 0.4) },
        ],
      },
    ],
  };
}
