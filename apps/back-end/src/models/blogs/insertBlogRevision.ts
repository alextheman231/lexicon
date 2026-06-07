import type { Connection } from "src/database/connection";
import type { BlogRevision, BlogRevisionInsert } from "src/database/schema";

import { az } from "@alextheman/utility";
import z from "zod";

import { blogRevisionsTable } from "src/database/schema";

async function insertBlogRevision(
  connection: Connection,
  data: BlogRevisionInsert,
): Promise<BlogRevision> {
  const [blogRevision] = await connection.insert(blogRevisionsTable).values(data).returning();
  return {
    ...blogRevision,
    content: az.with(z.record(z.string(), z.any())).parse(blogRevision.content),
  };
}

export default insertBlogRevision;
