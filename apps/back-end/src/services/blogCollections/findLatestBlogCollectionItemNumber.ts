import type { LockConfig } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { desc, eq } from "drizzle-orm";

import { blogCollectionItemsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface FindLatestBlogCollectionItemNumberOptions {
  forUpdate?: LockConfig;
}

async function findLatestBlogCollectionItemNumber(
  connection: Connection,
  blogCollectionId: string,
  options?: FindLatestBlogCollectionItemNumberOptions,
): Promise<number | null> {
  const query = (() => {
    const query = connection
      .select({ itemNumber: blogCollectionItemsTable.itemNumber })
      .from(blogCollectionItemsTable)
      .where(eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId))
      .orderBy(desc(blogCollectionItemsTable.itemNumber))
      .limit(1);

    if (options?.forUpdate) {
      return query.for("update", options.forUpdate);
    }

    return query;
  })();

  const collectionItem = await fetchSole(query);

  return collectionItem === null ? null : collectionItem.itemNumber;
}

export default findLatestBlogCollectionItemNumber;
