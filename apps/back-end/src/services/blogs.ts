import type { Blog, BlogInsertData, BlogView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { assertNotNull } from "@alextheman/utility";
import { parseBlog, parseBlogInsertData, parseBlogView } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { blogRevisionsTable, blogsTable } from "src/database/schema";

export async function selectBlogView(
  connection: Connection,
  blogId: string,
): Promise<BlogView | null> {
  const [blog] = await connection
    .select({
      id: blogsTable.id,
      authorId: blogsTable.authorId,
      updatedAt: blogsTable.updatedAt,
      publishedAt: blogsTable.publishedAt,
      title: blogRevisionsTable.title,
      content: blogRevisionsTable.content,
    })
    .from(blogsTable)
    .leftJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
    .where(eq(blogsTable.id, blogId));

  return blog ? parseBlogView(blog) : null;
}

export async function insertBlog(connection: Connection, data: BlogInsertData): Promise<Blog> {
  const parsedData = parseBlogInsertData(data);

  return await connection.transaction(async (transaction) => {
    const [initialBlog] = await transaction
      .insert(blogsTable)
      .values({
        id: parsedData.id,
        authorId: parsedData.authorId,
      })
      .returning();

    assertNotNull(initialBlog);

    const [revision] = await transaction
      .insert(blogRevisionsTable)
      .values({
        editorId: parsedData.authorId,
        blogId: initialBlog.id,
        title: parsedData.title,
        content: parsedData.content,
        revision: 1,
      })
      .returning();

    assertNotNull(revision);

    await transaction
      .update(blogsTable)
      .set({ currentRevisionId: revision.id })
      .where(eq(blogsTable.id, initialBlog.id));

    const [blog] = await transaction
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.id, initialBlog.id));

    return parseBlog(blog);
  });
}
