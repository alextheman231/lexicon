import type { Connection } from "src/database/connection";
import type { BlogCollection } from "src/database/schema";

import { blogCollectionsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function selectBlogCollections(connection: Connection): Promise<Array<BlogCollection>> {
  const collections = await fetchAll(connection.select().from(blogCollectionsTable));
  return collections;
}

export default selectBlogCollections;
