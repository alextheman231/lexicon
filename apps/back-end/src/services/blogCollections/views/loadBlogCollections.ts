import type { BlogCollection } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { eq, inArray, sql } from "drizzle-orm";

import { blogCollectionsTable, usersTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function loadBlogCollections(
  connection: Connection,
  blogCollectionIds: Array<string>,
): Promise<Array<BlogCollection>> {
  const blogCollections = await fetchAll(
    connection
      .select({
        id: blogCollectionsTable.id,
        userId: blogCollectionsTable.userId,
        username: usersTable.username,
        userDisplayName: usersTable.displayName,
        name: blogCollectionsTable.name,
        createdAt: blogCollectionsTable.createdAt,
        description: blogCollectionsTable.description,
      })
      .from(blogCollectionsTable)
      .innerJoin(usersTable, eq(blogCollectionsTable.userId, usersTable.id))
      .where(inArray(blogCollectionsTable.id, blogCollectionIds))
      .orderBy(
        sql`ARRAY_POSITION(${sql.param(blogCollectionIds)}::UUID[], ${blogCollectionsTable.id})`,
      ),
  );

  return blogCollections;
}

export default loadBlogCollections;
