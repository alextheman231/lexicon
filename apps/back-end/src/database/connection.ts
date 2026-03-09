import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { DataError, parseEnv } from "@alextheman/utility";
// eslint-disable-next-line @alextheman/no-namespace-imports
import * as schema from "@lexicon/schema";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import path from "node:path";

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

const connection = drizzle(pool, { schema });

export type Connection = NodePgDatabase<typeof schema>;

export { pool };
export default connection;
