import type { Connection } from "src/database/connection";

import { and, eq, gt, sql } from "drizzle-orm";

import { blogCollectionItemsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function removeBlogCollectionItem(
  connection: Connection,
  blogCollectionId: string,
  blogCollectionItemId: string,
): Promise<boolean> {
  const deletedItem = await fetchSole(
    connection
      .delete(blogCollectionItemsTable)
      .where(
        and(
          eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId),
          eq(blogCollectionItemsTable.id, blogCollectionItemId),
        ),
      )
      .returning(),
  );

  if (deletedItem === null) {
    return false;
  }

  await connection
    .update(blogCollectionItemsTable)
    .set({
      itemNumber: sql`${blogCollectionItemsTable.itemNumber} - 1`,
    })
    .where(
      and(
        eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId),
        gt(blogCollectionItemsTable.itemNumber, deletedItem.itemNumber),
      ),
    );

  return true;
}

export default removeBlogCollectionItem;
