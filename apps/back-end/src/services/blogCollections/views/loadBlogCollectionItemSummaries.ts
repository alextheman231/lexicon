import type { BlogCollectionItemSummary } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { eq, inArray, sql } from "drizzle-orm";

import {
  blogCollectionItemsTable,
  blogRevisionsTable,
  blogsTable,
  usersTable,
} from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function loadBlogCollectionItemSummaries(
  connection: Connection,
  blogCollectionItemIds: Array<string>,
): Promise<Array<BlogCollectionItemSummary>> {
  const items = await fetchAll(
    connection
      .select({
        id: blogCollectionItemsTable.id,
        itemNumber: blogCollectionItemsTable.itemNumber,
        blogId: blogCollectionItemsTable.blogId,
        blogCollectionId: blogCollectionItemsTable.blogCollectionId,
        blogTitle: blogRevisionsTable.title,
        authorId: blogsTable.authorId,
        authorDisplayName: usersTable.displayName,
        authorUsername: usersTable.username,
        blogUpdatedAt: blogsTable.updatedAt,
        blogPublishedAt: blogsTable.publishedAt,
      })
      .from(blogCollectionItemsTable)
      .innerJoin(blogsTable, eq(blogCollectionItemsTable.blogId, blogsTable.id))
      .innerJoin(blogRevisionsTable, eq(blogsTable.currentRevisionId, blogRevisionsTable.id))
      .innerJoin(usersTable, eq(blogsTable.authorId, usersTable.id))
      .where(inArray(blogCollectionItemsTable.id, blogCollectionItemIds))
      .orderBy(
        sql`ARRAY_POSITION(${sql.param(blogCollectionItemIds)}::UUID[], ${blogCollectionItemsTable.id})`,
      ),
  );
  return items.map((item) => {
    return { ...item, authorDisplayName: item.authorDisplayName ?? item.authorUsername };
  });
}

export default loadBlogCollectionItemSummaries;
