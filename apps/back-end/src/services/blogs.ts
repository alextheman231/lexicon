import type { Blog, BlogInsertData, BlogSummary, BlogView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { assertNotNull } from "@alextheman/utility";
import { BlogState, parseBlog, parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { blogRevisionsTable, blogsTable, blogStateHistoryTable } from "src/database/schema";

// TODO: Pagination
export async function selectBlogSummaries(connection: Connection): Promise<Array<BlogSummary>> {
  const blogs = await connection
    .select({
      id: blogsTable.id,
      authorId: blogsTable.authorId,
      updatedAt: blogsTable.updatedAt,
      state: blogsTable.state,
      publishedAt: blogsTable.publishedAt,
      title: blogRevisionsTable.title,
    })
    .from(blogsTable)
    .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId));

  return parseBlogSummaries(blogs);
}

export async function selectBlogView(
  connection: Connection,
  blogId: string,
): Promise<BlogView | null> {
  const [blog] = await connection
    .select({
      id: blogsTable.id,
      authorId: blogsTable.authorId,
      updatedAt: blogsTable.updatedAt,
      state: blogsTable.state,
      publishedAt: blogsTable.publishedAt,
      title: blogRevisionsTable.title,
      content: blogRevisionsTable.content,
    })
    .from(blogsTable)
    .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
    .where(eq(blogsTable.id, blogId));

  return blog ? parseBlogView(blog) : null;
}

export async function insertBlog(
  connection: Connection,
  data: BlogInsertData & { id?: string; authorId: string },
): Promise<Blog> {
  return await connection.transaction(async (transaction) => {
    const today = new Date();

    const isPublished = data.state === BlogState.PUBLISHED;
    const [initialBlog] = await transaction
      .insert(blogsTable)
      .values({
        id: data.id,
        authorId: data.authorId,
        state: data.state,
        publishedAt: isPublished ? today : null,
        updatedAt: today,
      })
      .returning();

    assertNotNull(initialBlog);

    const [revision] = await transaction
      .insert(blogRevisionsTable)
      .values({
        editorId: data.authorId,
        blogId: initialBlog.id,
        title: data.title,
        content: data.content,
        revision: 1,
      })
      .returning();

    assertNotNull(revision);

    await transaction
      .update(blogsTable)
      .set({ currentRevisionId: revision.id })
      .where(eq(blogsTable.id, initialBlog.id));

    await transaction.insert(blogStateHistoryTable).values({
      state: initialBlog.state,
      blogId: initialBlog.id,
      revisionId: revision.id,
      updatedById: initialBlog.authorId,
    });

    const [blog] = await transaction
      .select()
      .from(blogsTable)
      .where(eq(blogsTable.id, initialBlog.id));

    return parseBlog(blog);
  });
}
