import type { Connection } from "src/database/connection";

import { desc, eq } from "drizzle-orm";

import { blogRevisionsTable } from "src/database/schema";
import fetchFirst from "src/utility/databaseFilters/fetchFirst";

async function findLatestBlogVersion(
  connection: Connection,
  blogId: string,
): Promise<number | null> {
  const revision = await fetchFirst(
    connection
      .select({ version: blogRevisionsTable.version })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))
      .orderBy(desc(blogRevisionsTable.version)),
  );

  return revision === null ? null : revision.version;
}

export default findLatestBlogVersion;
