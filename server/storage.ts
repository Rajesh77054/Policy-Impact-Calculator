import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq } from "drizzle-orm";
import { userSessions, type UserSession, type InsertSession, type FormData, type PolicyResults } from "@shared/schema";

export interface IStorage {
  createSession(sessionId: string): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession>;
  updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession>;
  deleteSession(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }

    // Use connection pooling for better performance
    const poolUrl = process.env.DATABASE_URL.replace('.us-east-2', '-pooler.us-east-2');
    const pool = new Pool({
      connectionString: poolUrl,
      max: 10,
    });

    this.db = drizzle(pool);
  }

  async createSession(sessionId: string): Promise<UserSession> {
    const [session] = await this.db
      .insert(userSessions)
      .values({
        sessionId,
        formData: null,
        results: null,
        createdAt: Date.now(),
      })
      .returning();

    return session;
  }

  async getSession(sessionId: string): Promise<UserSession | undefined> {
    const [session] = await this.db
      .select()
      .from(userSessions)
      .where(eq(userSessions.sessionId, sessionId))
      .limit(1);

    return session;
  }

  async updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession> {
    const [session] = await this.db
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
    const [session] = await this.db
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
    await this.db
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