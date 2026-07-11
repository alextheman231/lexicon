import { fillArray } from "@alextheman/utility";
import { parseBlogSummaries } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("Isolated test setup", () => {
  test("Generates 10 blogs", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const testClient = await fixtures.authenticatedClient;

    const blogs = await fillArray(
      async () => {
        const { blog } = await factory.blogs.insertWithRevision();
        return blog;
      },
      10,
      { sequential: true },
    );

    const blogIds = blogs.map((blog) => {
      return blog.id;
    });

    const { body } = await testClient.get("/api/v1/blogs").expect(200);

    const blogSummaries = parseBlogSummaries(body.blogs);
    expect(blogSummaries.length).toBe(10);

    for (const blogSummary of blogSummaries) {
      expect(blogIds.includes(blogSummary.id)).toBe(true);
    }
  });
  test("Generates 10 more blogs independently from the above test", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const testClient = await fixtures.authenticatedClient;

    const blogs = await fillArray(
      async () => {
        const { blog } = await factory.blogs.insertWithRevision();
        return blog;
      },
      10,
      { sequential: true },
    );

    const blogIds = blogs.map((blog) => {
      return blog.id;
    });

    const { body } = await testClient.get("/api/v1/blogs").expect(200);

    const blogSummaries = parseBlogSummaries(body.blogs);
    expect(blogSummaries.length).toBe(10);

    for (const blogSummary of blogSummaries) {
      expect(blogIds.includes(blogSummary.id)).toBe(true);
    }
  });
});
