import type { BlogCollectionView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";

import { blogCollectionItemsTable, blogCollectionsTable, usersTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function loadBlogCollections(
  connection: Connection,
  blogCollectionIds: Array<string>,
): Promise<Array<BlogCollectionView>> {
  const itemCountCte = connection.$with("item_count_cte").as(
    connection
      .select({
        blogCollectionId: blogCollectionItemsTable.blogCollectionId,
        count: sql`COUNT(*)`.as("count"),
      })
      .from(blogCollectionItemsTable)
      .where(inArray(blogCollectionItemsTable.blogCollectionId, blogCollectionIds))
      .groupBy(blogCollectionItemsTable.blogCollectionId),
  );

  const blogCollections = await fetchAll(
    connection
      .with(itemCountCte)
      .select({
        id: blogCollectionsTable.id,
        userId: blogCollectionsTable.userId,
        username: usersTable.username,
        userDisplayName: usersTable.displayName,
        name: blogCollectionsTable.name,
        createdAt: blogCollectionsTable.createdAt,
        description: blogCollectionsTable.description,
        itemCount: sql`COALESCE(${itemCountCte.count}, 0)`,
      })
      .from(blogCollectionsTable)
      .innerJoin(usersTable, eq(blogCollectionsTable.userId, usersTable.id))
      .leftJoin(itemCountCte, eq(itemCountCte.blogCollectionId, blogCollectionsTable.id))
      .where(inArray(blogCollectionsTable.id, blogCollectionIds))
      .orderBy(
        sql`ARRAY_POSITION(${sql.param(blogCollectionIds)}::UUID[], ${blogCollectionsTable.id})`,
      ),
  );

  return blogCollections.map((blogCollection) => {
    return {
      ...blogCollection,
      itemCount: az.with(z.coerce.number().int().nonnegative()).parse(blogCollection.itemCount),
    };
  });
}

export default loadBlogCollections;
