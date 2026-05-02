import type { BlogInsertData } from "@lexicon/models";

import {
  assertNotNull,
  assertNotUndefined,
  fillArray,
  isSameDate,
  omitProperties,
} from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { eq } from "drizzle-orm";
import BlogFactory from "factory/blogs";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable } from "src/database/schema";
import app from "src/server/app";

describe("GET", () => {
  describe("/api/v1/blogs", () => {
    test("Returns all the blogs from all users", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blogs = await fillArray(async () => {
        return await factory.blogs.insert();
      }, 10);
      const blogIds = blogs.map((blog) => {
        return blog.id;
      });

      const { body } = await authenticatedClient.get("/api/v1/blogs").expect(200);

      const blogSummaries = parseBlogSummaries(body.blogs);
      expect(blogSummaries.length).toBe(10);

      for (const blogSummary of blogSummaries) {
        if (blogIds.includes(blogSummary.id)) {
          const blog = blogs.find((blog) => {
            return blogSummary.id === blog.id;
          });

          assertNotUndefined(blog);
          expect(blogSummary).toMatchObject(omitProperties(blog, "currentRevisionId"));

          const [revision] = await connection
            .select({
              title: blogRevisionsTable.title,
              content: blogRevisionsTable.content,
            })
            .from(blogRevisionsTable)
            .where(eq(blogRevisionsTable.id, blog.currentRevisionId));

          assertNotNull(revision);

          expect(blogSummary.title).toBe(revision.title);
        } else {
          throw new DataError(
            { blogViewId: blogSummary.id, blogIds },
            "BLOG_NOT_FOUND",
            "Could not find the fetched blog",
          );
        }
      }
    });
  });

  describe("/api/v1/blogs/<blogId>", () => {
    test("Returns the blog with the given blog ID", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blog = await factory.blogs.insert();

      const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

      const blogView = parseBlogView(body.blog);
      expect(blogView).toMatchObject(omitProperties(blog, "currentRevisionId"));

      const [revision] = await connection
        .select({
          title: blogRevisionsTable.title,
          content: blogRevisionsTable.content,
        })
        .from(blogRevisionsTable)
        .where(eq(blogRevisionsTable.id, blog.currentRevisionId));

      assertNotNull(revision);

      expect(blogView.title).toBe(revision.title);
      expect(blogView.content).toEqual(revision.content);
    });
    test("Returns 404 if blog not found", async () => {
      const { authenticatedClient } = await getTestFixtures();
      const missingId = randomUUID();

      const { body } = await authenticatedClient.get(`/api/v1/blogs/${missingId}`).expect(404);

      const error = DataError.expectError(() => {
        throw body.error;
      });
      expect(error.code).toBe("RESOURCE_NOT_FOUND");
      expect(error.data.resourceId).toBe(missingId);
      expect(error.data.resourceType).toBe("blog");
    });
  });
});

describe("POST", () => {
  describe("/api/v1/blogs", () => {
    test("Inserts a blog into the database", async () => {
      const { authenticatedClient } = await getTestFixtures();

      const data: BlogInsertData = {
        state: BlogState.DRAFT,
        title: "Test blog",
        content: BlogFactory.generateEditorContent("Test blog"),
      };

      const { body } = await authenticatedClient.post("/api/v1/blogs").send(data).expect(201);

      expect(body).toHaveProperty("id");
      const { id: blogId } = body;

      const { body: getBody } = await authenticatedClient
        .get(`/api/v1/blogs/${blogId}`)
        .expect(200);
      const blogView = parseBlogView(getBody.blog);

      expect(blogView.id).toBe(blogId);
      expect(blogView).toMatchObject(data);
      expect(blogView.publishedAt).toBeNull();
    });
    test("Does not allow a non-authenticated user to post a blog", async () => {
      const data: BlogInsertData = {
        state: BlogState.DRAFT,
        title: "Test blog",
        content: BlogFactory.generateEditorContent("Test blog"),
      };

      const { body } = await request(app).post("/api/v1/blogs").send(data).expect(401);

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
      expect(error.code).toBe("INVALID_INSERT_DATA");
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

      const { body: getBody } = await authenticatedClient
        .get(`/api/v1/blogs/${blogId}`)
        .expect(200);
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
      expect(error.code).toBe("INVALID_INSERT_DATA");
    });
  });
});
