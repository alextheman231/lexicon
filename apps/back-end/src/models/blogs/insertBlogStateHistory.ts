import type { Connection } from "src/database/connection";
import type { BlogStateHistoryInsert, BlogStateHistoryRow } from "src/database/schema";

import { assertNotNull } from "@alextheman/utility";

import { blogStateHistoryTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertBlogStateHistory(
  connection: Connection,
  data: BlogStateHistoryInsert,
): Promise<BlogStateHistoryRow> {
  const blogStateHistory = await fetchSole(
    connection.insert(blogStateHistoryTable).values(data).returning(),
  );
  assertNotNull(blogStateHistory);
  return blogStateHistory;
}

export default insertBlogStateHistory;
