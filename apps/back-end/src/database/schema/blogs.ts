import { BlogState } from "@lexicon/models";
import {
  bigint,
  bigserial,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { usersTable } from "src/database/schema/users";

export const blogStateEnum = pgEnum<typeof BlogState>("BLOG_STATE_T", BlogState);

export const blogsTable = pgTable("blogs", {
  id: uuid("id").primaryKey().defaultRandom(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => {
      return usersTable.id;
    }),
  currentRevisionId: bigint("current_revision_id", { mode: "number" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
});

export const blogRevisionsTable = pgTable(
  "blog_revisions",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    editorId: uuid("editor_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
    blogId: uuid("blog_id")
      .notNull()
      .references(() => {
        return blogsTable.id;
      }),
    title: varchar("title", { length: 100 }).notNull(),
    content: jsonb("content").notNull(),
    revision: integer("revision").notNull(),
    revisionMessage: text("revision_message"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [
      uniqueIndex("blog_revision_per_blog_unique").on(table.blogId, table.revision),
      index("blog_revisions_blog_id_revision_idx").on(table.blogId, table.revision),
    ];
  },
);

export const blogStateHistoryTable = pgTable(
  "blog_state_history",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    updatedById: uuid("updated_by_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
    blogId: uuid("blog_id")
      .notNull()
      .references(() => {
        return blogsTable.id;
      }),
    state: blogStateEnum("state").notNull(),
    revisionId: bigint("revision_id", { mode: "number" })
      .notNull()
      .references(() => {
        return blogRevisionsTable.id;
      }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [index("blog_state_history_blog_id_idx").on(table.blogId)];
  },
);

export type Blog = typeof blogsTable.$inferSelect;
export type BlogRevision = typeof blogRevisionsTable.$inferSelect;
export type BlogStateHistoryRow = typeof blogStateHistoryTable.$inferSelect;
