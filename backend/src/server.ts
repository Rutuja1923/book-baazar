// src/server.ts
import express from "express";
import { db } from "@db";
import { sql } from "drizzle-orm";

const app = express();
const PORT = process.env.PORT || 3000;

// Basic health check endpoint
app.get("/health", async (req, res) => {
  try {
    // Test with simple SELECT 1
    const result = await db.execute(sql`SELECT 1`);
    res.json({
      status: "healthy",
      database: "connected",
      result: result[0], // Returns [{ "?column?": 1 }]
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    let errorMessage = "Database connection failed";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    res.status(500).json({
      status: "unhealthy",
      database: "connection failed",
      error: errorMessage,
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
