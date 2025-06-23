import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { formDataSchema } from "@shared/schema";
import { generateSessionId, calculatePolicyImpact } from "./utils/policy-calculator";
import { readExcelFile, extractCBOData } from "./utils/excel-reader";
import { setupAuth, isAuthenticated } from "./replitAuth";
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
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Create new session
  app.post("/api/session", async (req, res) => {
    try {
      console.log("Creating new session...");
      const sessionId = generateSessionId();
      console.log("Generated session ID:", sessionId);

      const session = await storage.createSession(sessionId);
      console.log("Session created in storage:", session);

      // Force session save
      req.session.policySessionId = sessionId;
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log("Session ID stored and saved:", sessionId);

      res.json({ sessionId });
    } catch (error: any) {
      console.error("Session creation error:", error.message, error.stack);
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
      let sessionId = req.session.policySessionId;
      console.log("Form data update - Session ID:", sessionId);
      console.log('Form data update - Full session object:', req.session);
      console.log('Form data update - Raw body:', req.body);

      if (!sessionId) {
        console.log('No session ID found in request.session:', req.session);
        // Try to find existing session first
        const existingSessions = await storage.getSessions();

        if (existingSessions.length > 0) {
          sessionId = existingSessions[0].sessionId;
          req.session.policySessionId = sessionId;
          console.log('Reusing existing session:', sessionId);
        } else {
          // Create emergency session only if no existing sessions
          sessionId = generateSessionId();
          console.log('Creating emergency session with ID:', sessionId);
          req.session.policySessionId = sessionId;

          const newSession = await storage.createSession(sessionId);

          return res.json(newSession);
        }
      }

      const validatedData = formDataSchema.parse(req.body);
      console.log("Form data update - Validated data:", JSON.stringify(validatedData, null, 2));

      const session = await storage.updateSessionFormData(sessionId, validatedData);
      console.log("Form data update - Updated session:", JSON.stringify(session.formData, null, 2));

      res.json(session);
    } catch (error: any) {
      console.error("Form data update error:", error.message, error.stack);
      res.status(400).json({ message: error.message });
    }
  });

  // Calculate policy impact
  app.post("/api/calculate", async (req, res) => {
    try {
      const sessionId = req.session.policySessionId;
      console.log('Calculate request - Session ID:', sessionId);

      if (!sessionId) {
        console.error("No session ID found for calculation");
        return res.status(400).json({ 
          message: "Session expired. Please restart the calculator." 
        });
      }

      const session = await storage.getSession(sessionId);
      console.log("Calculate request - Session data:", JSON.stringify(session, null, 2));

      if (!session) {
        console.error("Session not found in storage:", sessionId);
        return res.status(400).json({ 
          message: "Session not found. Please restart the calculator." 
        });
      }

      if (!session.formData) {
        console.error("Form data missing from session:", sessionId);
        return res.status(400).json({ 
          message: "Form data incomplete. Please complete all steps." 
        });
      }

      console.log("Calculating for form data:", JSON.stringify(session.formData, null, 2));
      const results = await calculatePolicyImpact(session.formData);
      console.log("Calculation results:", JSON.stringify(results, null, 2));

      const updatedSession = await storage.updateSessionResults(sessionId, results);

      res.json(updatedSession);
    } catch (error: any) {
      console.error("Calculate error:", error.message, error.stack);
      res.status(500).json({ 
        message: "Calculation failed. Please try again.",
        details: error.message 
      });
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
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}