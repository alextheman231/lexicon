import type z from "zod";

import { az } from "@alextheman/utility";
import { date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  dateOfBirth: date("date_of_birth"),
  description: text("description"),
  displayName: varchar("display_name", { length: 50 }),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  profilePictureFileKey: text("profile_picture_file_key"),
  profilePictureFileName: text("profile_picture_file_name"),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  username: varchar("username", { length: 100 }).notNull().unique(),
});

export const userSchema = createSelectSchema(usersTable);
export type User = z.infer<typeof userSchema>;
export function parseUser(input: unknown): User {
  return az.with(userSchema).parse(input);
}

export type UserInsert = typeof usersTable.$inferInsert;
export type UserUpdate = Partial<UserInsert>;
