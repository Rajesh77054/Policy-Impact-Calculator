import { eq } from "drizzle-orm";
import { userSessions, users, type UserSession, type InsertSession, type FormData, type PolicyResults, type User, type UpsertUser } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Session operations
  createSession(sessionId: string): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  getSessions(): Promise<UserSession[]>;
  updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession>;
  updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession>;
  deleteSession(sessionId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Session operations
  async createSession(sessionId: string): Promise<UserSession> {
    const [session] = await db
      .insert(userSessions)
      .values({
        sessionId,
        formData: null,
        results: null,
        createdAt: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
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

  async getSessions(): Promise<UserSession[]> {
    const sessions = await db
      .select()
      .from(userSessions)
      .orderBy(userSessions.createdAt);
    
    return sessions;
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
  private users: Map<string, User>;
  private currentId: number;

  constructor() {
    this.sessions = new Map();
    this.users = new Map();
    this.currentId = 1;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: userData.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async createSession(sessionId: string): Promise<UserSession> {
    const id = this.currentId++;
    const session: UserSession = {
      id,
      sessionId,
      formData: null,
      results: null,
      createdAt: Math.floor(Date.now() / 1000), // Unix timestamp in seconds
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

  async getSessions(): Promise<UserSession[]> {
    return Array.from(this.sessions.values()).sort((a, b) => a.createdAt - b.createdAt);
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