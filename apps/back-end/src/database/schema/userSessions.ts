import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "src/database/schema/users";

export const userSessionsTable = pgTable(
  "user_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: "cascade" },
      ),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [
      index("user_sessions_user_id_idx").on(table.userId),
      index("user_sessions_expires_at_idx").on(table.expiresAt),
    ];
  },
);
