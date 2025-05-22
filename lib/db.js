import { Pool } from "pg";

let pool;

export const getDB = () => {
  if (!pool) {
    // Try DATABASE_URL first, then fall back to individual variables
    const connectionConfig = process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl:
            process.env.NODE_ENV === "production"
              ? { rejectUnauthorized: false }
              : false,
        }
      : {
          host: process.env.PG_HOST,
          port: process.env.PG_PORT || 5432,
          user: process.env.PG_USER,
          password: process.env.PG_PASSWORD,
          database: process.env.PG_DATABASE,
          ssl:
            process.env.NODE_ENV === "production"
              ? { rejectUnauthorized: false }
              : false,
        };

    pool = new Pool({
      ...connectionConfig,
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

// Export a single instance
const db = getDB();
export default db;
