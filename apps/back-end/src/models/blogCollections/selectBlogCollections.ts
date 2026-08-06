import type { Connection } from "src/database/connection";
import type { BlogCollection } from "src/database/schema";

import { inArray } from "drizzle-orm";

import { blogCollectionsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function selectBlogCollections(
  connection: Connection,
  blogCollectionIds: Array<string>,
): Promise<Array<BlogCollection>> {
  const collections = await fetchAll(
    connection
      .select()
      .from(blogCollectionsTable)
      .where(inArray(blogCollectionsTable.id, blogCollectionIds)),
  );
  return collections;
}

export default selectBlogCollections;
