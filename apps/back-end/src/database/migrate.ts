import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

import path from "node:path";

import { getConnection } from "src/database/connection";

(async () => {
  const connection = getConnection();
  try {
    console.info("Applying migrations to database...");
    await migrate(connection, {
      migrationsFolder: path.join(process.cwd(), "src", "database", "migrations"),
    });
    console.info("Migrations applied successfully!");
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection.$client instanceof Pool) {
      await connection.$client.end();
    }
  }
})();
