import type { Connection } from "src/database/connection";
import type { BlogCollectionItem } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogCollectionItemsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function loadBlogCollectionItemsByBlogCollectionId(
  connection: Connection,
  blogCollectionId: string,
): Promise<Array<BlogCollectionItem>> {
  const items = await fetchAll(
    connection
      .select()
      .from(blogCollectionItemsTable)
      .where(eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId)),
  );
  return items;
}

export default loadBlogCollectionItemsByBlogCollectionId;
