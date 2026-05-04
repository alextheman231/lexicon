import type { PoolClient } from "pg";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { afterEach, beforeEach } from "vitest";

import { getConnection, pool, setConnection } from "src/database/connection";
// eslint-disable-next-line @alextheman/no-namespace-imports
import * as schema from "src/database/schema";

let client: PoolClient;

beforeEach(async () => {
  client = await pool.connect();

  const testConnection = drizzle(client, { schema });
  setConnection(testConnection);

  const connection = getConnection();
  await connection.execute(sql`BEGIN`);
});

afterEach(async () => {
  const connection = getConnection();
  await connection.execute(sql`ROLLBACK`);
  client.release();
});
