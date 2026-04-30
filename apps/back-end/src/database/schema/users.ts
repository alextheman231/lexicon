import { date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  dateOfBirth: date("date_of_birth"),
  description: text("description"),
  displayName: varchar("display_name", { length: 50 }),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  username: varchar("username", { length: 100 }).notNull().unique(),
});

export type User = typeof usersTable.$inferSelect;
