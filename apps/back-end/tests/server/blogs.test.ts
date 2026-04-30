import { assertNotNull, omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseBlogView } from "@lexicon/models";
import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable } from "src/database/schema";

describe("GET", () => {
  describe("/api/v1/blogs/<blogId>", () => {
    test("Returns the blog with the given blog ID", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blog = await factory.blogs.insert();

      const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

      const blogView = parseBlogView(body.blog);
      expect(blogView).toMatchObject(omitProperties(blog, ["createdAt", "currentRevisionId"]));

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
