import type { BlogSummary } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { eq, inArray, sql } from "drizzle-orm";

import { blogRevisionsTable, blogsTable, usersTable } from "src/database/schema";

async function loadBlogSummaries(
  connection: Connection,
  blogIds?: Array<string>,
): Promise<Array<BlogSummary>> {
  if (blogIds && blogIds.length === 0) {
    return [];
  }
  const baseQuery = connection
    .select({
      id: blogsTable.id,
      authorId: blogsTable.authorId,
      authorUsername: usersTable.username,
      authorDisplayName: usersTable.displayName,
      updatedAt: blogsTable.updatedAt,
      state: blogsTable.state,
      publishedAt: blogsTable.publishedAt,
      title: blogRevisionsTable.title,
    })
    .from(blogsTable)
    .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
    .innerJoin(usersTable, eq(blogsTable.authorId, usersTable.id));

  const query = blogIds
    ? baseQuery
        .where(inArray(blogsTable.id, blogIds))
        .orderBy(sql`ARRAY_POSITION(${sql.param(blogIds)}::UUID[], ${blogsTable.id})`)
    : baseQuery;

  const blogs = await query;
  return blogs.map((blog) => {
    return {
      ...blog,
      authorDisplayName: blog.authorDisplayName ?? blog.authorUsername,
    };
  });
}

export default loadBlogSummaries;
