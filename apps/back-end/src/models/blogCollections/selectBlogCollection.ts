import type { Connection } from "src/database/connection";
import type { BlogCollection } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogCollectionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function selectBlogCollection(
  connection: Connection,
  blogCollectionId: string,
): Promise<BlogCollection | null> {
  const blogCollection = await fetchSole(
    connection
      .select()
      .from(blogCollectionsTable)
      .where(eq(blogCollectionsTable.id, blogCollectionId)),
  );
  return blogCollection;
}

export default selectBlogCollection;
