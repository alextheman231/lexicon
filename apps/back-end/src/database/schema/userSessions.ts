import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "src/database/schema/users";

export const userSessionsTable = pgTable(
  "user_sessions",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(
        () => {
          return usersTable.id;
        },
        { onDelete: "cascade" },
      ),
  },
  (table) => {
    return [
      index("user_sessions_user_id_idx").on(table.userId),
      index("user_sessions_expires_at_idx").on(table.expiresAt),
    ];
  },
);

export type UserSessionInsert = typeof userSessionsTable.$inferInsert;
