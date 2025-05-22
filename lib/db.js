import { Pool } from "pg";

let pool;

export const getDB = () => {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
      max: 1, // Limit the pool size in serverless environment
      idleTimeoutMillis: 0, // Close idle connections immediately
      connectionTimeoutMillis: 10000, // 10 seconds
    });

    // Handle pool errors
    pool.on("error", (err) => {
      console.error("Database pool error:", err);
    });
  }

  return pool;
};

export default getDB();
