import { integer, pgTable, text, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { blogsTable } from "src/database/schema/blogs";
import { usersTable } from "src/database/schema/users";

export const blogCollectionsTable = pgTable(
  "blog_collections",
  {
    description: text("description"),
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => {
        return usersTable.id;
      }),
  },
  (table) => {
    return [uniqueIndex("blog_collection_name_per_user_unique").on(table.userId, table.name)];
  },
);

export const blogCollectionItemsTable = pgTable(
  "blog_collection_items",
  {
    blogCollectionId: uuid("blog_collection_id")
      .notNull()
      .references(
        () => {
          return blogCollectionsTable.id;
        },
        { onDelete: "cascade" },
      ),
    blogId: uuid("blog_id")
      .notNull()
      .references(
        () => {
          return blogsTable.id;
        },
        { onDelete: "cascade" },
      ),
    id: uuid("id").primaryKey().defaultRandom(),
    itemNumber: integer("item_number").notNull(),
  },
  (table) => {
    return [
      uniqueIndex("blog_collection_item_number_per_blog_collection_unique").on(
        table.itemNumber,
        table.blogCollectionId,
      ),
      uniqueIndex("blog_collection_blog_unique").on(table.blogCollectionId, table.blogId),
    ];
  },
);

export type BlogCollection = typeof blogCollectionsTable.$inferSelect;
export type BlogCollectionInsert = typeof blogCollectionsTable.$inferInsert;

export type BlogCollectionItem = typeof blogCollectionItemsTable.$inferSelect;
export type BlogCollectionItemInsert = typeof blogCollectionItemsTable.$inferInsert;
