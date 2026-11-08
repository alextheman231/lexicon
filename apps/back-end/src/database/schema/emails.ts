import { EmailIdent } from "@lexicon/models";
import { jsonb, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

import { usersTable } from "src/database/schema/users";

export const emailIdentEnum = pgEnum<typeof EmailIdent>("EMAIL_IDENT_T", EmailIdent);

export const emailsTable = pgTable("emails", {
  context: jsonb("context").notNull(),
  id: uuid("id").primaryKey().defaultRandom(),
  ident: emailIdentEnum("ident").notNull(),
  recipientId: uuid("recipient_id")
    .notNull()
    .references(() => {
      return usersTable.id;
    }),
  sentAt: timestamp("sent_at", { withTimezone: true }),
});

export type Email = typeof emailsTable.$inferSelect;
export type EmailInsert = typeof emailsTable.$inferInsert;
