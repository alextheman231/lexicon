import type { BlogView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { eq } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable, blogsTable, usersTable } from "src/database/schema";

async function loadBlogView(connection: Connection, blogId: string): Promise<BlogView | null> {
  const [blog] = await connection
    .select({
      id: blogsTable.id,
      authorId: blogsTable.authorId,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      updatedAt: blogsTable.updatedAt,
      state: blogsTable.state,
      publishedAt: blogsTable.publishedAt,
      title: blogRevisionsTable.title,
      content: blogRevisionsTable.content,
    })
    .from(blogsTable)
    .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
    .innerJoin(usersTable, eq(blogsTable.authorId, usersTable.id))
    .where(eq(blogsTable.id, blogId));

  if (blog) {
    return {
      ...blog,
      authorDisplayName: blog.authorDisplayName ?? blog.authorUsername,
      content: az.with(z.record(z.string(), z.any())).parse(blog.content),
    };
  }

  return null;
}

export default loadBlogView;
