import type { Connection } from "src/database/connection";

import { addDaysToDate, assertNotNull } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import { and, eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

import { blogStateHistoryTable } from "src/database/schema";
import selectBlog from "src/models/blogs/selectBlog";
import changeBlogState from "src/services/blogs/mutations/changeBlogState";
import deleteArchivedBlogs from "src/workers/deleteArchivedBlogs";

async function editBlogStateHistory(connection: Connection, blogId: string, newDate: Date) {
  await connection
    .update(blogStateHistoryTable)
    .set({ updatedAt: newDate })
    .where(
      and(
        eq(blogStateHistoryTable.blogId, blogId),
        eq(blogStateHistoryTable.state, BlogState.ARCHIVED),
      ),
    );
}

describe("deleteArchivedBlogs", () => {
  test("Deletes blogs that have been archived for 30 or more days", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const today = new Date();

    const { blog: blogToDelete } = await factory.blogs.insertWithRevision({
      state: BlogState.ARCHIVED,
    });
    await editBlogStateHistory(connection, blogToDelete.id, addDaysToDate(today, -30));
    const { blog: otherBlogToDelete } = await factory.blogs.insertWithRevision({
      state: BlogState.ARCHIVED,
    });
    await editBlogStateHistory(connection, otherBlogToDelete.id, addDaysToDate(today, -31));

    const { blog: archivedBlogToKeep } = await factory.blogs.insertWithRevision({
      state: BlogState.ARCHIVED,
    });
    await editBlogStateHistory(connection, archivedBlogToKeep.id, addDaysToDate(today, -29));

    const { blog: publishedBlog } = await factory.blogs.insertWithRevision({
      state: BlogState.PUBLISHED,
    });
    const { blog: draftBlog } = await factory.blogs.insertWithRevision({ state: BlogState.DRAFT });

    await deleteArchivedBlogs.execute();

    const blogToDeleteAfter = await selectBlog(connection, blogToDelete.id);
    expect(blogToDeleteAfter).toBeNull();

    const otherBlogToDeleteAfter = await selectBlog(connection, otherBlogToDelete.id);
    expect(otherBlogToDeleteAfter).toBeNull();

    const blogToKeepAfter = await selectBlog(connection, archivedBlogToKeep.id);
    assertNotNull(blogToKeepAfter);
    expect(blogToKeepAfter.state).toBe(BlogState.ARCHIVED);

    const publishedBlogAfter = await selectBlog(connection, publishedBlog.id);
    assertNotNull(publishedBlogAfter);
    expect(publishedBlogAfter.state).toBe(publishedBlog.state);

    const draftBlogAfter = await selectBlog(connection, draftBlog.id);
    assertNotNull(draftBlogAfter);
    expect(draftBlogAfter.state).toBe(draftBlog.state);
  });
  test("Keeps blogs that were archived again within the last 30 days", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const today = new Date();

    const { blog } = await factory.blogs.insertWithRevision({ state: BlogState.ARCHIVED });
    const editor = await factory.users.insert();
    await editBlogStateHistory(connection, blog.id, addDaysToDate(today, -60));
    await changeBlogState(
      connection,
      { blogId: blog.id, editorId: editor.id },
      BlogState.PUBLISHED,
    );
    await changeBlogState(connection, { blogId: blog.id, editorId: editor.id }, BlogState.ARCHIVED);

    await deleteArchivedBlogs.execute();

    const blogAfter = await selectBlog(connection, blog.id);
    assertNotNull(blogAfter);
    expect(blogAfter.state).toBe(BlogState.ARCHIVED);
  });
});
