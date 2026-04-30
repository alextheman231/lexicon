import { AuthProvider } from "@lexicon/models";
import { index, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "src/database/schema/users";

export const authProviderEnum = pgEnum<typeof AuthProvider>("AUTH_PROVIDER_T", AuthProvider);

export const authProvidersTable = pgTable(
  "auth_providers",
  {
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    id: uuid("id").primaryKey().defaultRandom(),
    provider: authProviderEnum("provider").notNull(),
    providerUserId: text("provider_user_id").notNull(),
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
      unique("provider_identity_unique").on(table.provider, table.providerUserId),
      unique("user_provider_unique").on(table.userId, table.provider),
      index("auth_providers_user_id_idx").on(table.userId),
    ];
  },
);

export type AuthProviderSchema = typeof authProvidersTable.$inferSelect;
