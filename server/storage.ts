import { eq } from "drizzle-orm";
import { userSessions, type UserSession, type InsertSession, type FormData, type PolicyResults } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  createSession(sessionId: string): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession>;
  updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession>;
  deleteSession(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {

  async createSession(sessionId: string): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values({
        sessionId,
        formData: null,
        results: null,
        createdAt: Math.floor(Date.now() / 1000), // Use seconds instead of milliseconds
      })
      .returning();

    return session;
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionId, sessionId))
      .limit(1);

    return session;
  }

  async updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession> {
    const [session] = await db
      .update(userSessions)
      .set({ formData })
      .where(eq(userSessions.sessionId, sessionId))
      .returning();

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  async updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession> {
    const [session] = await db
      .update(userSessions)
      .set({ results })
      .where(eq(userSessions.sessionId, sessionId))
      .returning();

    if (!session) {
      throw new Error("Session not found");
    }

    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await db
      .delete(userSessions)
      .where(eq(userSessions.sessionId, sessionId));
  }
}

// Fallback to memory storage if database is not available
export class MemStorage implements IStorage {
  private sessions: Map<string, UserSession>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.currentId = 1;
  }

  async createSession(sessionId: string): Promise<UserSession> {
    const id = this.currentId++;
    const session: UserSession = {
      id,
      sessionId,
      formData: null,
      results: null,
      createdAt: Date.now(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    return this.sessions.get(sessionId);
  }

  async updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updatedSession = { ...session, formData };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }

    const updatedSession = { ...session, results };
    this.sessions.set(sessionId, updatedSession);
    return updatedSession;
  }

  async deleteSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}

// Initialize storage with database or fallback to memory
function createStorage(): IStorage {
  try {
    if (process.env.DATABASE_URL) {
      console.log("✅ Using PostgreSQL database storage");
      return new DatabaseStorage();
    } else {
      console.log("⚠️  DATABASE_URL not found, using memory storage");
      return new MemStorage();
    }
  } catch (error) {
    console.error("❌ Failed to initialize database storage, falling back to memory:", error);
    return new MemStorage();
  }
}

export const storage = createStorage();