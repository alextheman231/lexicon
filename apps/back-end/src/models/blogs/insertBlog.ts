import type { Connection } from "src/database/connection";
import type { Blog, BlogInsert } from "src/database/schema";

import { assertNotNullable } from "@alextheman/utility";

import { blogsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertBlog(connection: Connection, data: BlogInsert): Promise<Blog> {
  const blog = await fetchSole(connection.insert(blogsTable).values(data).returning());
  assertNotNullable(blog);
  return blog;
}

export default insertBlog;
