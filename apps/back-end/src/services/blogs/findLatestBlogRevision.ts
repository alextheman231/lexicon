import type { Connection } from "src/database/connection";

import { desc, eq } from "drizzle-orm";

import { blogRevisionsTable } from "src/database/schema";

async function findLatestBlogVersion(
  connection: Connection,
  blogId: string,
): Promise<number | null> {
  const [revision] = await connection
    .select({ version: blogRevisionsTable.version })
    .from(blogRevisionsTable)
    .where(eq(blogRevisionsTable.blogId, blogId))
    .orderBy(desc(blogRevisionsTable.version));
  return revision?.version === undefined || revision?.version === null ? null : revision.version;
}

export default findLatestBlogVersion;
