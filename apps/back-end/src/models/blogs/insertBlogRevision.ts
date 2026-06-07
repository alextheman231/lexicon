import type { Connection } from "src/database/connection";
import type { BlogRevision, BlogRevisionInsert } from "src/database/schema";

import { blogRevisionsTable, parseBlogRevision } from "src/database/schema";

async function insertBlogRevision(
  connection: Connection,
  data: BlogRevisionInsert,
): Promise<BlogRevision> {
  const [blogRevision] = await connection.insert(blogRevisionsTable).values(data).returning();
  // Data needs to be parsed here because the content on the returned revision is unknown whereas the BlogRevision type is Json.
  return parseBlogRevision(blogRevision);
}

export default insertBlogRevision;
