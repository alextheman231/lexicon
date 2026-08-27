import type { BlogView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az, omitProperties } from "@alextheman/utility";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable, blogsTable, usersTable } from "src/database/schema";
import getProfilePictureUrl from "src/services/users/views/getProfilePictureUrl";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface BlogViewFilter {
  blogId: string;
  revisionNumber?: number;
}

async function loadBlogView(
  connection: Connection,
  { blogId, revisionNumber }: BlogViewFilter,
): Promise<BlogView | null> {
  const blog = await fetchSole(
    connection
      .select({
        id: blogsTable.id,
        revisionNumber: blogRevisionsTable.version,
        authorId: blogsTable.authorId,
        authorUsername: usersTable.username,
        authorDisplayName: usersTable.displayName,
        authorProfilePictureFileKey: usersTable.profilePictureFileKey,
        updatedAt: blogsTable.updatedAt,
        state: blogsTable.state,
        publishedAt: blogsTable.publishedAt,
        title: blogRevisionsTable.title,
        content: blogRevisionsTable.content,
      })
      .from(blogsTable)
      .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.blogId, blogsTable.id))
      .innerJoin(usersTable, eq(blogsTable.authorId, usersTable.id))
      .where(
        and(
          eq(blogsTable.id, blogId),
          revisionNumber !== undefined
            ? eq(blogRevisionsTable.version, revisionNumber)
            : eq(blogRevisionsTable.id, blogsTable.currentRevisionId),
        ),
      ),
  );

  if (blog === null) {
    return null;
  }

  return {
    ...omitProperties(blog, "authorProfilePictureFileKey"),
    authorProfilePictureUrl: getProfilePictureUrl({
      id: blog.authorId,
      profilePictureFileKey: blog.authorProfilePictureFileKey,
    }),
    content: az.with(z.record(z.string(), z.any())).parse(blog.content),
  };
}

export default loadBlogView;
