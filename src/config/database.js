import "dotenv/config";

import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required");
}

const parsedDatabaseUrl = new URL(databaseUrl);
const isNeonLocalHost = ["localhost", "127.0.0.1", "neon-local"].includes(
  parsedDatabaseUrl.hostname,
);

if (isNeonLocalHost) {
  const fetchHost = parsedDatabaseUrl.hostname;
  const fetchPort = parsedDatabaseUrl.port || "5432";

  neonConfig.fetchEndpoint =
    process.env.NEON_FETCH_ENDPOINT || `http://${fetchHost}:${fetchPort}/sql`;
  neonConfig.useSecureWebSocket = false;
  neonConfig.poolQueryViaFetch = true;
}

const sql = neon(databaseUrl); // this takes the connection string and craetes the raw database connection

const db = drizzle(sql); //takes the raw connection and wraps it with the query builder , now insted of the rawSQL , we get the clean javascript api

export { sql, db };
