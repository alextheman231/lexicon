import type { Connection } from "src/database/connection";
import type { BlogCollection, BlogCollectionInsert } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogCollectionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function updateBlogCollection(
  connection: Connection,
  blogCollectionId: string,
  data: Partial<BlogCollectionInsert>,
): Promise<BlogCollection | null> {
  const blogCollection = await fetchSole(
    connection
      .update(blogCollectionsTable)
      .set(data)
      .where(eq(blogCollectionsTable.id, blogCollectionId))
      .returning(),
  );
  return blogCollection;
}

export default updateBlogCollection;
