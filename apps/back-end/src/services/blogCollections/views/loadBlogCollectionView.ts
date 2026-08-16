import type { BlogCollectionView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { eq } from "drizzle-orm";

import { blogCollectionsTable, usersTable } from "src/database/schema";
import countBlogCollectionItems from "src/services/blogCollections/views/countBlogCollectionItems";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function loadBlogCollectionView(
  connection: Connection,
  blogCollectionId: string,
): Promise<BlogCollectionView | null> {
  const blogCollection = await fetchSole(
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
      .where(eq(blogCollectionsTable.id, blogCollectionId)),
  );

  if (blogCollection === null) {
    return null;
  }

  const itemCount = await countBlogCollectionItems(connection, blogCollectionId);

  return {
    ...blogCollection,
    itemCount,
  };
}

export default loadBlogCollectionView;
