import type { Connection } from "src/database/connection";
import type { BlogCollectionItem, BlogCollectionItemInsert } from "src/database/schema";

import { assertNotNull } from "@alextheman/utility";

import { blogCollectionItemsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertBlogCollectionItem(
  connection: Connection,
  data: BlogCollectionItemInsert,
): Promise<BlogCollectionItem> {
  const blogCollectionItem = await fetchSole(
    connection.insert(blogCollectionItemsTable).values(data).returning(),
  );
  assertNotNull(blogCollectionItem);
  return blogCollectionItem;
}

export default insertBlogCollectionItem;
