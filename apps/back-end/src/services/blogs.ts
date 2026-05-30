import type {
  Blog,
  BlogFilter,
  BlogSummary,
  BlogView,
  CreateBlogData,
  EditBlogData,
} from "@lexicon/models";
import type { SQL } from "drizzle-orm";

import type { Connection } from "src/database/connection";

import { assertNotNull, az } from "@alextheman/utility";
import { BlogState, parseBlog, parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { desc, eq, inArray, sql } from "drizzle-orm";
import z from "zod";

import { blogRevisionsTable, blogsTable, usersTable } from "src/database/schema";
import {
  insertBlog,
  insertBlogRevision,
  insertBlogStateHistory,
  selectBlog,
  updateBlog,
} from "src/models/blogs";
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

export async function getLatestBlogVersion(
  connection: Connection,
  blogId: string,
): Promise<number | null> {
  const [{ version }] = await connection
    .select({ version: blogRevisionsTable.version })
    .from(blogRevisionsTable)
    .where(eq(blogRevisionsTable.blogId, blogId))
    .orderBy(desc(blogRevisionsTable.version));
  return version === undefined || version === null ? null : az.with(z.int()).parse(version);
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

export async function createBlog(
  connection: Connection,
  authorId: string,
  data: CreateBlogData,
): Promise<Blog> {
  return await connection.transaction(async (transaction) => {
    const today = new Date();

    const isPublished = data.state === BlogState.PUBLISHED;
    const initialBlog = await insertBlog(transaction, {
      ...data,
      authorId,
      publishedAt: isPublished ? today : null,
      updatedAt: today,
    });
    const revision = await insertBlogRevision(transaction, {
      editorId: authorId,
      blogId: initialBlog.id,
      title: data.title,
      content: data.content,
      version: 1,
    });
    await updateBlog(transaction, initialBlog.id, { currentRevisionId: revision.id });
    await insertBlogStateHistory(transaction, {
      state: initialBlog.state,
      blogId: initialBlog.id,
      revisionId: revision.id,
      updatedById: initialBlog.authorId,
    });

    const blog = await selectBlog(transaction, initialBlog.id);
    assertNotNull(blog);

    return parseBlog(blog);
  });
}

interface Ids {
  blogId: string;
  editorId: string;
}

export async function editBlog(
  connection: Connection,
  ids: Ids,
  data: Omit<EditBlogData, "state">,
): Promise<Blog | null> {
  return await connection.transaction(async (transaction) => {
    const oldVersionNumber = await getLatestBlogVersion(transaction, ids.blogId);

    if (oldVersionNumber === null) {
      return null;
    }

    const { id: newRevisionId } = await insertBlogRevision(transaction, {
      title: data.title,
      content: data.content,
      blogId: ids.blogId,
      editorId: ids.editorId,
      version: oldVersionNumber + 1,
    });

    const blog = await updateBlog(transaction, ids.blogId, {
      currentRevisionId: newRevisionId,
      updatedAt: new Date(),
    });

    return blog ? parseBlog(blog) : null;
  });
}

export async function changeBlogState(
  connection: Connection,
  ids: Ids,
  newState: BlogState,
): Promise<Blog | null> {
  return await connection.transaction(async (transaction) => {
    const currentBlog = await selectBlog(transaction, ids.blogId);
    const today = new Date();

    if (currentBlog === null) {
      return null;
    }

    if (currentBlog.state === newState) {
      return parseBlog(currentBlog);
    }

    const blog = await updateBlog(transaction, ids.blogId, {
      state: newState,
      updatedAt: today,
      publishedAt: newState === BlogState.PUBLISHED ? new Date() : null,
    });
    assertNotNull(blog);
    const { currentRevisionId } = blog;
    assertNotNull(currentRevisionId);

    await insertBlogStateHistory(transaction, {
      state: newState,
      updatedById: ids.editorId,
      updatedAt: today,
      blogId: ids.blogId,
      revisionId: currentRevisionId,
    });

    return blog ? parseBlog(blog) : null;
  });
}
