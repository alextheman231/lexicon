import type { PoolClient } from "pg";

import type { getConnection } from "src/database/connection";

import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { afterEach, beforeEach, vi } from "vitest";

import { pool } from "src/database/connection";
// eslint-disable-next-line @alextheman/no-namespace-imports -- Needed for the spy that ensures that the connection we use in tests is the test connection.
import * as dbModule from "src/database/connection";
// eslint-disable-next-line @alextheman/no-namespace-imports -- Allows our connection to be typed with respect to our database schema.
import * as schema from "src/database/schema";

let client: PoolClient;
let testConnection: ReturnType<typeof getConnection>;

beforeEach(async () => {
  client = await pool.connect();

  testConnection = drizzle(client, { schema });

  vi.spyOn(testConnection, "transaction").mockImplementation(async (callback) => {
    // @ts-expect-error: The testConnection is not typed in exactly the same way as
    // actual transactions, so this gives a type error.
    // However this is needed for testing purposes as the tests already run in a transaction, and
    // nested transactions confuse CI.
    // This is fine for most use cases as we generally treat the transaction and connection the same and query them the same way.
    // In the future, I will revisit this to get nested transaction to actually work.
    return await callback(testConnection);
  });
  vi.spyOn(dbModule, "getConnection").mockReturnValue(testConnection);
  await testConnection.execute(sql`BEGIN`);
});

afterEach(async () => {
  await testConnection.execute(sql`ROLLBACK`);
  vi.restoreAllMocks();
  client.release();
});
