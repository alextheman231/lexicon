import type { BlogRevision } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type {
  Blog,
  BlogInsert,
  BlogRevisionInsert,
  BlogStateHistoryInsert,
  BlogStateHistoryRow,
  BlogUpdate,
} from "src/database/schema";

import { parseBlog, parseBlogRevision, parseBlogStateHistoryRow } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { blogRevisionsTable, blogsTable, blogStateHistoryTable } from "src/database/schema";

export async function selectBlog(connection: Connection, blogId: string): Promise<Blog | null> {
  const [blog] = await connection.select().from(blogsTable).where(eq(blogsTable.id, blogId));
  return blog ? parseBlog(blog) : null;
}

export async function insertBlog(connection: Connection, data: BlogInsert): Promise<Blog> {
  const [blog] = await connection.insert(blogsTable).values(data).returning();
  // TODO: Separate model parsing
  return blog;
}

export async function updateBlog(connection: Connection, blogId: string, data: BlogUpdate) {
  const [blog] = await connection
    .update(blogsTable)
    .set(data)
    .where(eq(blogsTable.id, blogId))
    .returning();
  return blog ? parseBlog(blog) : null;
}

export async function insertBlogRevision(
  connection: Connection,
  data: BlogRevisionInsert,
): Promise<BlogRevision> {
  const [blogRevision] = await connection.insert(blogRevisionsTable).values(data).returning();
  return parseBlogRevision(blogRevision);
}

export async function insertBlogStateHistory(
  connection: Connection,
  data: BlogStateHistoryInsert,
): Promise<BlogStateHistoryRow> {
  const [blogStateHistory] = await connection
    .insert(blogStateHistoryTable)
    .values(data)
    .returning();
  return parseBlogStateHistoryRow(blogStateHistory);
}
