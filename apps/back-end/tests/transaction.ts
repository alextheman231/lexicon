import { sql } from "drizzle-orm";
import { afterEach, beforeEach } from "vitest";

import connection from "src/database/connection";

beforeEach(async () => {
  await connection.execute(sql`BEGIN`);
  await connection.execute(sql`SAVEPOINT vitest`);
});

afterEach(async () => {
  await connection.execute(sql`ROLLBACK TO SAVEPOINT vitest`);
});
