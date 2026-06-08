import type { BlogFilter } from "@lexicon/models";

import {
  assertNotNull,
  assertNotUndefined,
  fillArray,
  omitProperties,
  paralleliseArrays,
} from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogSummaries, parseBlogSummariesResponse } from "@lexicon/models";
import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable } from "src/database/schema";
import selectUser from "src/models/users/selectUser";

describe("GET /api/v1/blogs", () => {
  test("Returns all the blogs from all users", async () => {
    const { connection, factory, authenticatedClient } = await getTestFixtures();

    const blogs = await fillArray(
      async () => {
        const { blog } = await factory.blogs.insert();
        return blog;
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
      if (blogIds.includes(blogSummary.id)) {
        const blog = blogs.find((blog) => {
          return blogSummary.id === blog.id;
        });

        assertNotUndefined(blog);
        expect(omitProperties(blogSummary, ["authorDisplayName", "authorUsername"])).toMatchObject(
          omitProperties(blog, "currentRevisionId"),
        );

        const user = await selectUser(connection, { userId: blogSummary.authorId });
        assertNotNull(user);
        expect(blogSummary.authorDisplayName).toBe(user.displayName);
        expect(blogSummary.authorUsername).toBe(user.username);

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
  test("Takes pagination/filtering data through the query string", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const author = await factory.users.insert();

    const blogs = (
      await fillArray(
        async () => {
          const { blog } = await factory.blogs.insert({ author, state: BlogState.PUBLISHED });
          return blog;
        },
        10,
        { sequential: true },
      )
    ).toSorted((first, second) => {
      assertNotNull(first.publishedAt);
      assertNotNull(second.publishedAt);

      return second.publishedAt.getTime() - first.publishedAt.getTime();
    });

    const secondPageBlogs = blogs.slice(5, 10);

    const filters: BlogFilter = {
      authorId: author.id,
      state: BlogState.PUBLISHED,
      pageNumber: 2,
      pageSize: 5,
      sortColumn: "publishedAt",
      sortDirection: "desc",
    };

    const { body } = await authenticatedClient.get("/api/v1/blogs").query(filters).expect(200);

    const { blogs: blogSummaries, count } = parseBlogSummariesResponse(body);
    expect(count).toBe(10);
    expect(blogSummaries.length).toBe(secondPageBlogs.length);
    expect(secondPageBlogs.length).toBe(5);

    for (const [returnedBlog, factoryBlog] of paralleliseArrays(blogSummaries, secondPageBlogs)) {
      assertNotUndefined(factoryBlog);

      expect(returnedBlog.id).toBe(factoryBlog.id);
      expect(returnedBlog.authorId).toBe(author.id);
      expect(returnedBlog.authorDisplayName).toBe(author.displayName);
      expect(returnedBlog.authorUsername).toBe(author.username);
    }
  });
  test("Filtering by authorId works", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const author = await factory.users.insert();

    await fillArray(
      async () => {
        const { blog } = await factory.blogs.insert({ author });
        return blog;
      },
      5,
      { sequential: true },
    );

    await fillArray(
      async () => {
        await factory.blogs.insert();
      },
      3,
      { sequential: true },
    );

    const filters: BlogFilter = {
      authorId: author.id,
      pageNumber: 1,
      pageSize: 10,
    };

    const { body } = await authenticatedClient.get("/api/v1/blogs").query(filters).expect(200);

    const { blogs: blogSummaries, count } = parseBlogSummariesResponse(body);

    expect(blogSummaries.length).toBe(5);
    expect(count).toBe(5);

    for (const blogSummary of blogSummaries) {
      expect(blogSummary.authorId).toBe(author.id);
    }
  });
  test("Returns an empty array if the authorId is not found in database", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const filters: BlogFilter = {
      authorId: randomUUID(),
    };

    const { body } = await authenticatedClient.get("/api/v1/blogs").query(filters).expect(200);

    const { blogs, count } = parseBlogSummariesResponse(body);
    expect(blogs.length).toBe(0);
    expect(count).toBe(0);
  });
});
