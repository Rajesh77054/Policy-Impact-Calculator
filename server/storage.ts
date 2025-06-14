import { userSessions, type UserSession, type InsertSession, type FormData, type PolicyResults } from "@shared/schema";

export interface IStorage {
  createSession(sessionId: string): Promise<UserSession>;
  getSession(sessionId: string): Promise<UserSession | undefined>;
  updateSessionFormData(sessionId: string, formData: FormData): Promise<UserSession>;
  updateSessionResults(sessionId: string, results: PolicyResults): Promise<UserSession>;
  deleteSession(sessionId: string): Promise<void>;
}

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

export const storage = new MemStorage();
