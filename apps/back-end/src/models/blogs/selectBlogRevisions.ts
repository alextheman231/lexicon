import type { Connection } from "src/database/connection";
import type { BlogRevision } from "src/database/schema";

import { az } from "@alextheman/utility";
import { desc, eq } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

interface SelectBlogRevisionFilters {
  blogId: string;
}

async function selectBlogRevisions(
  connection: Connection,
  { blogId }: SelectBlogRevisionFilters,
): Promise<Array<BlogRevision>> {
  const revisions = await fetchAll(
    connection
      .select()
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))
      .orderBy(desc(blogRevisionsTable.version)),
  );

  return revisions.map((revision) => {
    return { ...revision, content: az.with(z.record(z.string(), z.any())).parse(revision.content) };
  });
}

export default selectBlogRevisions;
