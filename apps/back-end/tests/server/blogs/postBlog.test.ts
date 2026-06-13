import type { CreateBlogData } from "@lexicon/models";

import { assertNotNull, isSameDate } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogView } from "@lexicon/models";
import BlogFactory from "factory/blogs";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("POST /api/v1/blogs", () => {
  test("Inserts a blog into the database", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const data: CreateBlogData = {
      state: BlogState.DRAFT,
      title: "Test blog",
      content: BlogFactory.generateEditorContent("Test blog"),
    };

    const { body } = await authenticatedClient.post("/api/v1/blogs").send(data).expect(201);

    expect(body).toHaveProperty("id");
    const { id: blogId } = body;

    const { body: getBody } = await authenticatedClient.get(`/api/v1/blogs/${blogId}`).expect(200);
    const blogView = parseBlogView(getBody.blog);

    expect(blogView.id).toBe(blogId);
    expect(blogView).toMatchObject(data);
    expect(blogView.publishedAt).toBeNull();
  });
  test("Does not allow a non-authenticated user to post a blog", async () => {
    const data: CreateBlogData = {
      state: BlogState.DRAFT,
      title: "Test blog",
      content: BlogFactory.generateEditorContent("Test blog"),
    };

    const { body } = await testClient.post("/api/v1/blogs").send(data).expect(401);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("AUTH_REQUIRED");
    expect(error.data.sessionId).toBeUndefined();
  });
  test("Does not allow an ID in the data payload", async () => {
    const { authenticatedClient } = await getTestFixtures();
    const data = {
      id: randomUUID(),
      state: BlogState.DRAFT,
      title: "Test blog",
      content: BlogFactory.generateEditorContent("Test blog"),
    };

    const { body } = await authenticatedClient.post("/api/v1/blogs").send(data).expect(400);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.data.input).toEqual(data);
    expect(error.code).toBe("INVALID_BLOG_DATA");
  });
  test("If state is published, also set publishedAt", async () => {
    const { authenticatedClient } = await getTestFixtures();
    const data = {
      state: BlogState.PUBLISHED,
      title: "Test blog",
      content: BlogFactory.generateEditorContent("Test blog"),
    };

    const { body } = await authenticatedClient.post("/api/v1/blogs").send(data).expect(201);

    expect(body).toHaveProperty("id");
    const { id: blogId } = body;

    const { body: getBody } = await authenticatedClient.get(`/api/v1/blogs/${blogId}`).expect(200);
    const blogView = parseBlogView(getBody.blog);

    expect(blogView.id).toBe(blogId);
    expect(blogView).toMatchObject(data);
    assertNotNull(blogView.publishedAt);
    expect(isSameDate(blogView.publishedAt, new Date())).toBe(true);
  });
  test("Does not allow inserting a blog with an initially archived state", async () => {
    const { authenticatedClient } = await getTestFixtures();
    const data = {
      state: BlogState.ARCHIVED,
      title: "Test blog",
      content: BlogFactory.generateEditorContent("Test blog"),
    };

    const { body } = await authenticatedClient.post("/api/v1/blogs").send(data).expect(400);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.data.input).toEqual(data);
    expect(error.code).toBe("INVALID_BLOG_DATA");
  });
});
