import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

export const db = new Pool({
  connectionString,
});

export async function testDatabaseConnection() {
  const result = await db.query("SELECT NOW() AS current_time");

  return result.rows[0];
}
