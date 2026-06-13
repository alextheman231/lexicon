import type { Connection } from "src/database/connection";
import type { BlogCollection, BlogCollectionInsert } from "src/database/schema";

import { assertNotNull } from "@alextheman/utility";

import { blogCollectionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertBlogCollection(
  connection: Connection,
  data: BlogCollectionInsert,
): Promise<BlogCollection> {
  const blogCollection = await fetchSole(
    connection.insert(blogCollectionsTable).values(data).returning(),
  );
  assertNotNull(blogCollection);
  return blogCollection;
}

export default insertBlogCollection;
