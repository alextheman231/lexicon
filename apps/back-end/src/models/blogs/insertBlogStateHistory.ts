import type { Connection } from "src/database/connection";
import type { BlogStateHistoryInsert, BlogStateHistoryRow } from "src/database/schema";

import { blogStateHistoryTable } from "src/database/schema";

async function insertBlogStateHistory(
  connection: Connection,
  data: BlogStateHistoryInsert,
): Promise<BlogStateHistoryRow> {
  const [blogStateHistory] = await connection
    .insert(blogStateHistoryTable)
    .values(data)
    .returning();
  return blogStateHistory;
}

export default insertBlogStateHistory;
