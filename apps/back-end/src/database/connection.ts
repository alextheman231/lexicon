import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PoolClient } from "pg";

import { parseEnv } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import path from "node:path";

// eslint-disable-next-line @alextheman/no-namespace-imports
import * as schema from "src/database/schema";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

const envFilePath = path.resolve(process.cwd(), `.env.${ENV}`);

dotenv.config({
  path: envFilePath,
});

const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new DataError(
    { envFilePath },
    "DATABASE_URL_NOT_SET",
    "Tried to find a database URL in your .env file but could not find it.",
  );
}

const pool = new Pool({
  connectionString: DATABASE_URL,
});

export type Connection = NodePgDatabase<typeof schema> & {
  $client?: Pool | PoolClient;
};

let connection: Connection = drizzle(pool, { schema });

export function getConnection(): Connection {
  return connection;
}

export function setConnection(newConnection: Connection): void {
  connection = newConnection;
}

export { pool };
export default connection;
