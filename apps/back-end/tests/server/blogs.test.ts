import { assertNotNull, assertNotUndefined, fillArray, omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseBlogSummaries, parseBlogView } from "@lexicon/models";
import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable } from "src/database/schema";

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
