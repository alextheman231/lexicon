import type { Connection } from "src/database/connection";
import type { BlogRevision } from "src/database/schema";

import { az } from "@alextheman/utility";
import { eq } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable } from "src/database/schema";

interface SelectBlogRevisionFilters {
  blogId: string;
}

async function selectBlogRevisions(
  connection: Connection,
  { blogId }: SelectBlogRevisionFilters,
): Promise<Array<BlogRevision>> {
  const revisions = await connection
    .select()
    .from(blogRevisionsTable)
    .where(eq(blogRevisionsTable.blogId, blogId));

  return revisions.map((revision) => {
    return { ...revision, content: az.with(z.record(z.string(), z.any())).parse(revision.content) };
  });
}

export default selectBlogRevisions;
