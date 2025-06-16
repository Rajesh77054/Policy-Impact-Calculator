import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { formDataSchema } from "@shared/schema";
import { generateSessionId, calculatePolicyImpact } from "./utils/policy-calculator";
import { readExcelFile, extractCBOData } from "./utils/excel-reader";
import multer from 'multer';
import path from 'path';

declare module 'express-session' {
  interface SessionData {
    policySessionId: string;
  }
}

interface ReplitUser {
  id: string;
  name: string;
  profileImage: string;
  bio: string;
  url: string;
  roles: string[];
  teams: string[];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'policy-calculator-secret-' + Math.random().toString(36),
    resave: false,
    saveUninitialized: true,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      sameSite: 'strict'
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
      console.log("Form data update - Session ID:", sessionId);
      console.log("Form data update - Raw body:", JSON.stringify(req.body, null, 2));

      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const validatedData = formDataSchema.parse(req.body);
      console.log("Form data update - Validated data:", JSON.stringify(validatedData, null, 2));

      const session = await storage.updateSessionFormData(sessionId, validatedData);
      console.log("Form data update - Updated session:", JSON.stringify(session.formData, null, 2));

      res.json(session);
    } catch (error: any) {
      console.error("Form data update error:", error.message);
      res.status(400).json({ message: error.message });
    }
  });

  // Calculate policy impact
  app.post("/api/calculate", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      console.log("Calculate request - Session ID:", sessionId);

      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      console.log("Calculate request - Session data:", JSON.stringify(session, null, 2));

      if (!session || !session.formData) {
        return res.status(400).json({ message: "Form data not found" });
      }

      console.log("Calculating for form data:", JSON.stringify(session.formData, null, 2));
      const results = calculatePolicyImpact(session.formData);
      console.log("Calculation results:", JSON.stringify(results, null, 2));

      const updatedSession = await storage.updateSessionResults(sessionId, results);

      res.json(updatedSession);
    } catch (error: any) {
      console.error("Calculate error:", error.message, error.stack);
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

  // Get current authenticated user
  app.get("/api/user", async (req, res) => {
    try {
      const userId = req.headers['x-replit-user-id'];
      const userName = req.headers['x-replit-user-name'];
      const userProfileImage = req.headers['x-replit-user-profile-image'];
      const userBio = req.headers['x-replit-user-bio'];
      const userUrl = req.headers['x-replit-user-url'];
      const userRoles = req.headers['x-replit-user-roles'];
      const userTeams = req.headers['x-replit-user-teams'];

      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user: ReplitUser = {
        id: userId as string,
        name: userName as string || 'Anonymous',
        profileImage: userProfileImage as string || '',
        bio: userBio as string || '',
        url: userUrl as string || '',
        roles: userRoles ? (userRoles as string).split(',') : [],
        teams: userTeams ? (userTeams as string).split(',') : []
      };

      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Generate PDF report (requires authentication)
  app.post("/api/download-pdf", async (req, res) => {
    try {
      const userId = req.headers['x-replit-user-id'];
      const userName = req.headers['x-replit-user-name'];

      if (!userId) {
        return res.status(401).json({ message: "Authentication required for PDF download" });
      }

      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session || !session.results) {
        return res.status(404).json({ message: "Results not found" });
      }

      // Here you would implement actual PDF generation
      // For now, return a success message with user info
      res.json({
        message: "PDF generation initiated",
        fileName: `policy-report-${userName}-${Date.now()}.pdf`,
        user: { id: userId, name: userName }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Share results (requires authentication)
  app.post("/api/share-results", async (req, res) => {
    try {
      const userId = req.headers['x-replit-user-id'];
      const userName = req.headers['x-replit-user-name'];

      if (!userId) {
        return res.status(401).json({ message: "Authentication required for sharing results" });
      }

      const sessionId = req.session.policySessionId;
      if (!sessionId) {
        return res.status(404).json({ message: "No session found" });
      }

      const session = await storage.getSession(sessionId);
      if (!session || !session.results) {
        return res.status(404).json({ message: "Results not found" });
      }

      // Generate a shareable link (you could store this in your database)
      const shareId = `share-${sessionId}-${Date.now()}`;
      const shareUrl = `${req.protocol}://${req.get('host')}/results?share=${shareId}`;

      res.json({
        message: "Share link generated",
        shareUrl,
        shareId,
        user: { id: userId, name: userName }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

    // Configure multer for file uploads
  const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
      const allowedTypes = ['.xlsx', '.xls'];
      const fileExt = path.extname(file.originalname).toLowerCase();
      if (allowedTypes.includes(fileExt)) {
        cb(null, true);
      } else {
        cb(new Error('Only Excel files (.xlsx, .xls) are allowed'));
      }
    }
  });

  // Excel file upload endpoint
  app.post("/api/upload-cbo-data", upload.single('excelFile'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("Processing uploaded Excel file:", req.file.originalname);

      // Read the Excel file
      const excelData = readExcelFile(req.file.path);

      // Extract CBO-specific data
      const cboProvisions = extractCBOData(excelData);

      // Clean up uploaded file
      require('fs').unlinkSync(req.file.path);

      res.json({
        success: true,
        message: "CBO data processed successfully",
        sheets: Object.keys(excelData),
        provisions: cboProvisions
      });

    } catch (error) {
      console.error("Error processing Excel file:", error);
      res.status(500).json({ 
        error: "Failed to process Excel file",
        details: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}