import type { PoolClient } from "pg";

import type { getConnection } from "src/database/connection";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { afterEach, beforeEach, vi } from "vitest";

import { pool } from "src/database/connection";
// eslint-disable-next-line @alextheman/no-namespace-imports
import * as dbModule from "src/database/connection";
// eslint-disable-next-line @alextheman/no-namespace-imports
import * as schema from "src/database/schema";

let client: PoolClient;
let testConnection: ReturnType<typeof getConnection>;

beforeEach(async () => {
  client = await pool.connect();

  testConnection = drizzle(client, { schema });

  vi.spyOn(dbModule, "getConnection").mockReturnValue(testConnection);
  await testConnection.execute(sql`BEGIN`);
});

afterEach(async () => {
  await testConnection.execute(sql`ROLLBACK`);
  vi.restoreAllMocks();
  client.release();
});
