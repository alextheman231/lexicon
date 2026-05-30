import { fillArray } from "@alextheman/utility";
import { parseBlogSummaries } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";

describe("Isolated test setup", () => {
  test("Generates 10 blogs", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const blogs = await fillArray(
      async () => {
        return await factory.blogs.insert();
      },
      10,
      { sequential: true },
    );

    const blogIds = blogs.map((blog) => {
      return blog.id;
    });

    const { body } = await authenticatedClient.get("/api/v1/blogs").expect(200);

    const blogSummaries = parseBlogSummaries(body.blogs);
    expect(blogSummaries.length).toBe(10);

    for (const blogSummary of blogSummaries) {
      expect(blogIds.includes(blogSummary.id)).toBe(true);
    }
  });
  test("Generates 10 more blogs independently from the above test", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const blogs = await fillArray(
      async () => {
        return await factory.blogs.insert();
      },
      10,
      { sequential: true },
    );

    const blogIds = blogs.map((blog) => {
      return blog.id;
    });

    const { body } = await authenticatedClient.get("/api/v1/blogs").expect(200);

    const blogSummaries = parseBlogSummaries(body.blogs);
    expect(blogSummaries.length).toBe(10);

    for (const blogSummary of blogSummaries) {
      expect(blogIds.includes(blogSummary.id)).toBe(true);
    }
  });
});
