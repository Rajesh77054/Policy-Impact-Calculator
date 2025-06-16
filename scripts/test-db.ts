
import { db } from "../server/db";

async function testConnection() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test basic connection
    const result = await db.execute("SELECT NOW() as current_time");
    console.log("✅ Database connected successfully");
    console.log("Current time:", result.rows[0]);
    
    // Test table exists
    const tableCheck = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'user_sessions'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log("✅ user_sessions table exists");
    } else {
      console.log("❌ user_sessions table not found");
    }
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testConnection();
