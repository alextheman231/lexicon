import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { PoolClient } from "pg";

import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { readFile } from "node:fs/promises";
import path from "node:path";

// oxlint-disable-next-line typescript/no-namespace -- Needed to give the connection access to our schema types.
import * as schema from "src/database/schema";
import loadEnvironment from "src/utility/env/loadEnvironment";
import DataError from "src/utility/errors/DataError";

const ENV = loadEnvironment();

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
  ssl:
    ENV === "production"
      ? {
          ca: await readFile(path.join(process.cwd(), "aws-rds-global-bundle.pem"), "utf-8"),
        }
      : false,
});

export type Connection = NodePgDatabase<typeof schema> & {
  $client?: Pool | PoolClient;
};
export type Transaction = Parameters<Parameters<Connection["transaction"]>[0]>[0];

const connection: Connection = drizzle(pool, { schema });

export function getConnection(): Connection {
  return connection;
}

export { pool };
export default connection;
