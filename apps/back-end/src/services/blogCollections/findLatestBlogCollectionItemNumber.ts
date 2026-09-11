import type { Connection } from "src/database/connection";

import { desc, eq } from "drizzle-orm";

import { blogCollectionItemsTable } from "src/database/schema";
import fetchFirst from "src/utility/databaseFilters/fetchFirst";

async function findLatestBlogCollectionItemNumber(
  connection: Connection,
  blogCollectionId: string,
): Promise<number | null> {
  const collectionItem = await fetchFirst(
    connection
      .select({ itemNumber: blogCollectionItemsTable.itemNumber })
      .from(blogCollectionItemsTable)
      .where(eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId))
      .orderBy(desc(blogCollectionItemsTable.itemNumber)),
  );

  return collectionItem === null ? null : collectionItem.itemNumber;
}

export default findLatestBlogCollectionItemNumber;
