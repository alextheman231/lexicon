import type { BlogsFilter } from "@lexicon/models";

import {
  assertNotNull,
  assertNotUndefined,
  fillArray,
  omitProperties,
  paralleliseArrays,
  sortBy,
} from "@alextheman/utility";
import { CodeError, DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogSummaries, parseBlogSummariesResponse } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import selectUser from "src/models/users/selectUser";

describe("GET /api/v1/blogs", () => {
  test("Returns all the blogs from all users", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const factoryBlogs = await fillArray(
      async () => {
        return await factory.blogs.insertWithRevision();
      },
      10,
      { sequential: true },
    );

    const blogIds = factoryBlogs.map(({ blog }) => {
      return blog.id;
    });

    const { body } = await testClient.get("/api/v1/blogs").expect(200);

    const blogSummaries = parseBlogSummaries(body.blogs);
    expect(blogSummaries.length).toBe(10);

    for (const blogSummary of blogSummaries) {
      if (blogIds.includes(blogSummary.id)) {
        const { blog, revision } =
          factoryBlogs.find(({ blog }) => {
            return blogSummary.id === blog.id;
          }) ?? {};

        assertNotUndefined(blog);
        expect(omitProperties(blogSummary, ["authorDisplayName", "authorUsername"])).toMatchObject(
          omitProperties(blog, "currentRevisionId"),
        );

        const user = await selectUser(connection, { userId: blogSummary.authorId });
        assertNotNull(user);
        expect(blogSummary.authorDisplayName).toBe(user.displayName);
        expect(blogSummary.authorUsername).toBe(user.username);

        assertNotUndefined(revision);

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
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const author = await factory.users.insert();

    const blogs = (
      await fillArray(
        async () => {
          const { blog } = await factory.blogs.insertWithRevision({
            author,
            state: BlogState.PUBLISHED,
          });
          return blog;
        },
        10,
        { sequential: true },
      )
    ).toSorted(
      sortBy((blog) => {
        assertNotNull(blog.publishedAt);
        return blog.publishedAt;
      }, "desc"),
    );

    const secondPageBlogs = blogs.slice(5, 10);

    const filters: BlogsFilter = {
      authorId: author.id,
      state: BlogState.PUBLISHED,
      pageNumber: 2,
      pageSize: 5,
      sortColumn: "publishedAt",
      sortDirection: "desc",
    };

    const { body } = await testClient.get("/api/v1/blogs").query(filters).expect(200);

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
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const author = await factory.users.insert();

    await fillArray(
      async () => {
        const { blog } = await factory.blogs.insertWithRevision({ author });
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

    const filters: BlogsFilter = {
      authorId: author.id,
      pageNumber: 1,
      pageSize: 10,
    };

    const { body } = await testClient.get("/api/v1/blogs").query(filters).expect(200);

    const { blogs: blogSummaries, count } = parseBlogSummariesResponse(body);

    expect(blogSummaries.length).toBe(5);
    expect(count).toBe(5);

    for (const blogSummary of blogSummaries) {
      expect(blogSummary.authorId).toBe(author.id);
    }
  });
  test("Returns an empty array if the authorId is not found in database", async () => {
    const filters: BlogsFilter = {
      authorId: randomUUID(),
    };

    const { body } = await testClient.get("/api/v1/blogs").query(filters).expect(200);

    const { blogs, count } = parseBlogSummariesResponse(body);
    expect(blogs.length).toBe(0);
    expect(count).toBe(0);
  });
  test.each<BlogState>([BlogState.ARCHIVED, BlogState.DRAFT])(
    "Filtering by current user in authorId filter allows us to filter by %s state",
    async (state) => {
      const fixtures = new TestFixtures();

      const factory = await fixtures.factory;
      const author = await fixtures.authenticatedUser;
      const testClient = await fixtures.authenticatedClient;

      const { blog } = await factory.blogs.insertWithRevision({ state, author });
      await factory.blogs.insertWithRevision({ state: BlogState.PUBLISHED });

      const filters: BlogsFilter = {
        authorId: author.id,
        state,
      };

      const { body } = await testClient.get(`/api/v1/blogs`).query(filters).expect(200);

      const { blogs } = parseBlogSummariesResponse(body);

      expect(blogs.length).toBe(1);
      expect(blogs[0].id).toBe(blog.id);
    },
  );
  test.each<BlogState>([BlogState.ARCHIVED, BlogState.DRAFT])(
    "Filtering by %s state without filtering by current user gives a forbidden access error",
    async (state) => {
      const fixtures = new TestFixtures();

      const factory = await fixtures.factory;

      const { blog } = await factory.blogs.insertWithRevision({ state });
      await factory.blogs.insertWithRevision({ state: BlogState.PUBLISHED });

      const filters: BlogsFilter = {
        authorId: blog.authorId,
        state,
      };

      const { body } = await testClient.get(`/api/v1/blogs`).query(filters).expect(403);

      const error = CodeError.expectError(() => {
        throw body.error;
      });

      expect(error.code).toBe("FORBIDDEN_ACCESS");
    },
  );
});
