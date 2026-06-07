import type { EditBlogData } from "@lexicon/models";

import { assertNotNull, isSameDate } from "@alextheman/utility";
import { CodeError, DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogView } from "@lexicon/models";
import { desc, eq } from "drizzle-orm";
import BlogFactory from "factory/blogs";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable, blogStateHistoryTable } from "src/database/schema";
import findLatestBlogVersion from "src/services/blogs/findLatestBlogRevision";

describe("PUT /api/v1/blogs/<blogId>", () => {
  test("Updates the current blog and creates a new revision", async () => {
    const { connection, factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blog = await factory.blogs.insert({ author: authenticatedUser });
    const oldRevisionNumber = await findLatestBlogVersion(connection, blog.id);
    assertNotNull(oldRevisionNumber);

    const data: Partial<EditBlogData> = {
      state: blog.state,
      title: "My edited blog",
      content: BlogFactory.generateEditorContent("This blog has been edited"),
    };

    await authenticatedClient.put(`/api/v1/blogs/${blog.id}`).send(data).expect(200);
    const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

    const blogView = parseBlogView(body.blog);
    expect(blogView.id).toBe(blog.id);
    expect(blogView.state).toBe(blog.state);
    expect(blogView.authorId).toBe(blog.authorId);
    expect(isSameDate(blogView.updatedAt, new Date())).toBe(true);

    expect(blogView.title).toBe(data.title);
    expect(blogView.content).toEqual(data.content);

    const newRevisionNumber = await findLatestBlogVersion(connection, blogView.id);
    expect(newRevisionNumber).toBe(oldRevisionNumber + 1);
  });
  test("Responds with a 404 error if the blog does not exist", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const data: EditBlogData = {
      state: BlogState.DRAFT,
      title: "My edited blog",
      content: BlogFactory.generateEditorContent("This blog has been edited"),
    };

    const missingId = randomUUID();

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${missingId}`)
      .send(data)
      .expect(404);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceType).toBe("blog");
    expect(error.data.resourceId).toBe(missingId);
  });
  test("If the blog state changed, insert a new state history record", async () => {
    const { connection, factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blog = await factory.blogs.insert({
      state: BlogState.DRAFT,
      author: authenticatedUser,
    });

    const data: EditBlogData = {
      state: BlogState.PUBLISHED,
      title: "My edited blog",
      content: BlogFactory.generateEditorContent("This blog has been edited"),
    };

    await authenticatedClient.put(`/api/v1/blogs/${blog.id}`).send(data).expect(200);
    const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

    const blogView = parseBlogView(body.blog);
    expect(blogView.state).toBe(data.state);

    const history = await connection
      .select()
      .from(blogStateHistoryTable)
      .where(eq(blogStateHistoryTable.blogId, blogView.id))
      .orderBy(desc(blogStateHistoryTable.id));

    expect(history[0].state).toBe(data.state);
    expect(history[1].state).toBe(blog.state);
  });
  test("Only updates the blog with the given ID", async () => {
    const { connection, factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const firstBlog = await factory.blogs.insert({ author: authenticatedUser });
    const secondBlog = await factory.blogs.insert({ author: authenticatedUser });

    const [{ secondBlogTitle, secondBlogContent }] = await connection
      .select({
        secondBlogTitle: blogRevisionsTable.title,
        secondBlogContent: blogRevisionsTable.content,
      })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, secondBlog.id));

    const data: EditBlogData = {
      state: BlogState.PUBLISHED,
      title: "My edited blog",
      content: BlogFactory.generateEditorContent("This blog has been edited"),
    };

    await authenticatedClient.put(`/api/v1/blogs/${firstBlog.id}`).send(data).expect(200);

    const { body } = await authenticatedClient.get(`/api/v1/blogs/${firstBlog.id}`).expect(200);
    const firstBlogView = parseBlogView(body.blog);

    expect(firstBlogView.title).toBe(data.title);
    expect(firstBlogView.content).toEqual(data.content);

    const { body: secondBlogRequest } = await authenticatedClient
      .get(`/api/v1/blogs/${secondBlog.id}`)
      .expect(200);
    const secondBlogView = parseBlogView(secondBlogRequest.blog);
    expect(secondBlogView.title).toBe(secondBlogTitle);
    expect(secondBlogView.content).toEqual(secondBlogContent);
  });
  test("Does not allow editing of a blog that does not belong to the current user", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const blog = await factory.blogs.insert();

    const data: EditBlogData = {
      state: BlogState.PUBLISHED,
      title: "My edited blog",
      content: BlogFactory.generateEditorContent("This blog has been edited"),
    };

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}`)
      .send(data)
      .expect(403);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
  });
});
