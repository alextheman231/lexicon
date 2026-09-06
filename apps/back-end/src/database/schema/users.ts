import { UserState } from "@lexicon/models";
import {
  bigserial,
  date,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userStateEnum = pgEnum<typeof UserState>("USER_STATE_T", UserState);

export const usersTable = pgTable("users", {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  dateOfBirth: date("date_of_birth"),
  description: text("description"),
  displayName: varchar("display_name", { length: 50 }),
  email: text("email").notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom(),
  passwordHash: text("password_hash"),
  profilePictureFileKey: text("profile_picture_file_key"),
  profilePictureFileName: text("profile_picture_file_name"),
  state: userStateEnum("state").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  username: varchar("username", { length: 100 }).notNull().unique(),
});

export type User = typeof usersTable.$inferSelect;
export type UserInsert = typeof usersTable.$inferInsert;
export type UserUpdate = Partial<UserInsert>;

export const userStateHistoryTable = pgTable(
  "user_state_history",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    state: userStateEnum("state").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    updatedById: uuid("updated_by_id").references(() => {
      return usersTable.id;
    }),
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
    return [index("user_state_history_user_id_idx").on(table.userId)];
  },
);

export type UserStateHistoryRow = typeof userStateHistoryTable.$inferSelect;
export type UserStateHistoryInsert = typeof userStateHistoryTable.$inferInsert;
export type UserStateHistoryUpdate = Partial<UserStateHistoryInsert>;
