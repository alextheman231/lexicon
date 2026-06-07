import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PoolClient } from "pg";

import { DataError } from "@alextheman/utility/v6";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import path from "node:path";

// eslint-disable-next-line @alextheman/no-namespace-imports
import * as schema from "src/database/schema";
import parseEnv from "src/utility/miscellaneous/parseEnv";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

const envFilePath = path.resolve(process.cwd(), `.env.${ENV}`);

if (ENV !== "production") {
  dotenv.config({
    path: envFilePath,
    quiet: ENV === "test",
  });
}

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new DataError(
    { envFilePath, NODE_ENV: ENV },
    "DATABASE_URL_NOT_SET",
    "Tried to find a database URL in your environment but could not find it.",
  );
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export type Connection = NodePgDatabase<typeof schema> & {
  $client?: Pool | PoolClient;
};

const connection: Connection = drizzle(pool, { schema });

export function getConnection(): Connection {
  return connection;
}

export { pool };
export default connection;
