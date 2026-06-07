import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { desc, eq } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable } from "src/database/schema";

async function findLatestBlogVersion(
  connection: Connection,
  blogId: string,
): Promise<number | null> {
  const [{ version }] = await connection
    .select({ version: blogRevisionsTable.version })
    .from(blogRevisionsTable)
    .where(eq(blogRevisionsTable.blogId, blogId))
    .orderBy(desc(blogRevisionsTable.version));
  return version === undefined || version === null ? null : az.with(z.int()).parse(version);
}

export default findLatestBlogVersion;
