import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { formDataSchema, policyResultsSchema } from "@shared/schema";
import { generateSessionId, calculatePolicyImpact } from "./utils/policy-calculator";

declare module 'express-session' {
  interface SessionData {
    policySessionId: string;
  }
}

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

  // Get data sources and methodology
  app.get("/api/methodology", async (req, res) => {
    try {
      const { DATA_SOURCES, METHODOLOGY } = await import("./data/sources");
      res.json({ sources: DATA_SOURCES, methodology: METHODOLOGY });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}


