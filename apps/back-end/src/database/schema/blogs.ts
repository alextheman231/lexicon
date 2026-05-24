import { BlogState } from "@lexicon/models";
import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  check,
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

export const blogsTable = pgTable(
  "blogs",
  {
    authorId: uuid("author_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
    currentRevisionId: bigint("current_revision_id", { mode: "number" }),
    id: uuid("id").primaryKey().defaultRandom(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    state: blogStateEnum("state").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => {
    return [
      check(
        "published_requires_timestamp",
        sql`
          (
            ${table.state} = ${sql.raw(`'${BlogState.PUBLISHED}'`)}
          ) = (
            ${table.publishedAt} IS NOT NULL
          )
        `,
      ),
    ];
  },
);

export const blogRevisionsTable = pgTable(
  "blog_revisions",
  {
    blogId: uuid("blog_id")
      .notNull()
      .references(() => {
        return blogsTable.id;
      }),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    editorId: uuid("editor_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
    id: bigserial("id", { mode: "number" }).primaryKey(),
    revision: integer("revision").notNull(),
    revisionMessage: text("revision_message"),
    title: varchar("title", { length: 100 }).notNull(),
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
    blogId: uuid("blog_id")
      .notNull()
      .references(() => {
        return blogsTable.id;
      }),
    id: bigserial("id", { mode: "number" }).primaryKey(),
    revisionId: bigint("revision_id", { mode: "number" })
      .notNull()
      .references(() => {
        return blogRevisionsTable.id;
      }),
    state: blogStateEnum("state").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    updatedById: uuid("updated_by_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
  },
  (table) => {
    return [index("blog_state_history_blog_id_idx").on(table.blogId)];
  },
);

export type Blog = typeof blogsTable.$inferSelect;
export type BlogInsert = typeof blogsTable.$inferInsert;
export type BlogUpdate = Partial<BlogInsert>;

export type BlogRevision = typeof blogRevisionsTable.$inferSelect;
export type BlogRevisionInsert = typeof blogRevisionsTable.$inferInsert;
export type BlogRevisionUpdate = Partial<BlogRevisionInsert>;

export type BlogStateHistoryRow = typeof blogStateHistoryTable.$inferSelect;
export type BlogStateHistoryInsert = typeof blogStateHistoryTable.$inferInsert;
export type BlogStateHistoryUpdate = Partial<BlogStateHistoryInsert>;
