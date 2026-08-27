import type { BlogSummary } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { omitProperties } from "@alextheman/utility";
import { eq, inArray, sql } from "drizzle-orm";

import { blogRevisionsTable, blogsTable, usersTable } from "src/database/schema";
import getProfilePictureUrl from "src/services/users/views/getProfilePictureUrl";
import fetchAll from "src/utility/databaseFilters/fetchAll";

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
      authorProfilePictureFileKey: usersTable.profilePictureFileKey,
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

  const blogs = await fetchAll(query);
  return blogs.map((blog) => {
    return {
      ...omitProperties(blog, "authorProfilePictureFileKey"),
      authorProfilePictureUrl: getProfilePictureUrl({
        id: blog.authorId,
        profilePictureFileKey: blog.authorProfilePictureFileKey,
      }),
    };
  });
}

export default loadBlogSummaries;
