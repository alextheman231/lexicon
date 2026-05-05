import type { Blog, BlogFilter, BlogInsertData, BlogSummary, BlogView } from "@lexicon/models";
import type { SQL } from "drizzle-orm";

import type { Connection } from "src/database/connection";

import { assertNotNull, az } from "@alextheman/utility";
import { BlogState, parseBlog, parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { eq, inArray, sql } from "drizzle-orm";
import z from "zod";

import {
  blogRevisionsTable,
  blogsTable,
  blogStateHistoryTable,
  usersTable,
} from "src/database/schema";
import paginate from "src/utility/paginate";

const BlogSortColumn = {
  updatedAt: blogsTable.updatedAt,
  publishedAt: blogsTable.publishedAt,
  state: blogsTable.state,
  title: blogRevisionsTable.title,
} as const;

function buildQuery(select: SQL, filters: BlogFilter): SQL {
  const conditions: Array<SQL> = [];

  if (filters.authorId) {
    conditions.push(sql`${blogsTable.authorId} = ${filters.authorId} `);
  }

  if (filters.state) {
    conditions.push(sql`${blogsTable.state} = ${filters.state} `);
  }

  const where = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

  const query = sql`
    SELECT ${select}
    FROM ${blogsTable}
    JOIN ${blogRevisionsTable} ON ${blogRevisionsTable.id} = ${blogsTable.currentRevisionId}
    ${where}
  `;

  if (filters.sortColumn && filters.sortDirection) {
    const sortColumn = BlogSortColumn[filters.sortColumn];
    query.append(sql`
      ORDER BY ${sortColumn} ${sql.raw(filters.sortDirection)}
    `);
  }

  if (filters.pageNumber && filters.pageSize) {
    query.append(paginate(filters.pageSize, filters.pageNumber));
  }

  return query;
}

export async function queryBlogIds(
  connection: Connection,
  filters: BlogFilter,
): Promise<Array<string>> {
  const { rows } = await connection.execute(buildQuery(sql`${blogsTable.id}`, filters));
  return az.with(z.array(z.uuid())).parse(
    rows.map((record) => {
      return record.id;
    }),
  );
}

export async function countBlogs(
  connection: Connection,
  filters: Omit<BlogFilter, "pageNumber" | "pageSize" | "sortColumn" | "sortDirection">,
): Promise<number> {
  const {
    rows: [{ count }],
  } = await connection.execute(buildQuery(sql`COUNT(*)`, filters));
  return az.with(az.fieldNumber().int()).parse(count);
}

export async function selectBlogSummaries(
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
