import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { DATABASE_URL } from "./db-url";
import { sql } from "drizzle-orm";

// Minimal test schema
const client = postgres(DATABASE_URL);
const db = drizzle(client, { logger: true });

async function testConnection() {
  try {
    console.log("Testing database connection...");

    // 1. Test raw connection
    await client`SELECT 1`;
    console.log("1. Raw connection test passed");

    // 2. Test Drizzle query
    const result = await db.execute(sql`SELECT 1`);
    console.log("2. Drizzle query test passed:", result);

    // 3. Test table operations (optional)
    await db.execute(sql`
      CREATE TEMPORARY TABLE test_connection (
        id SERIAL PRIMARY KEY,
        name TEXT
      )
    `);
    console.log("3. Temporary table created");

    // 4. Cleanup
    await db.execute(sql`DROP TABLE IF EXISTS test_connection`);
    console.log("Cleaned up temporary tables");

    console.log("All database tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("Database test failed:");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Execute the test
testConnection();
