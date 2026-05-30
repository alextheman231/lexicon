import type { BlogFilter, CreateBlogData, EditBlogData } from "@lexicon/models";

import {
  assertNotNull,
  assertNotUndefined,
  fillArray,
  isSameDate,
  omitProperties,
  paralleliseArrays,
} from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import {
  BlogState,
  parseBlogSummaries,
  parseBlogSummariesResponse,
  parseBlogView,
} from "@lexicon/models";
import { desc, eq } from "drizzle-orm";
import BlogFactory from "factory/blogs";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import { blogRevisionsTable, blogStateHistoryTable } from "src/database/schema";
import { selectUser } from "src/models/users";
import app from "src/server/app";
import { getLatestBlogVersion } from "src/services/blogs";

describe("GET", () => {
  describe("/api/v1/blogs", () => {
    test("Returns all the blogs from all users", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

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
        if (blogIds.includes(blogSummary.id)) {
          const blog = blogs.find((blog) => {
            return blogSummary.id === blog.id;
          });

          assertNotUndefined(blog);
          expect(
            omitProperties(blogSummary, ["authorDisplayName", "authorUsername"]),
          ).toMatchObject(omitProperties(blog, "currentRevisionId"));

          const user = await selectUser(connection, blogSummary.authorId);
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
            return await factory.blogs.insert({ author, state: BlogState.PUBLISHED });
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
          return await factory.blogs.insert({ author });
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

  describe("/api/v1/blogs/<blogId>", () => {
    test("Returns the blog with the given blog ID", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blog = await factory.blogs.insert();

      const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

      const blogView = parseBlogView(body.blog);
      expect(blogView).toMatchObject(omitProperties(blog, "currentRevisionId"));

      const user = await selectUser(connection, blogView.authorId);
      assertNotNull(user);
      expect(blogView.authorDisplayName).toBe(user.displayName);
      expect(blogView.authorUsername).toBe(user.username);

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

      const data: CreateBlogData = {
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
      const data: CreateBlogData = {
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
      expect(error.code).toBe("INVALID_BLOG_DATA");
    });
  });
});

describe("PUT", () => {
  describe("/api/v1/blogs/:blogId", () => {
    test("Updates the current blog and creates a new revision", async () => {
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blog = await factory.blogs.insert();
      const oldRevisionNumber = await getLatestBlogVersion(connection, blog.id);
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

      const newRevisionNumber = await getLatestBlogVersion(connection, blogView.id);
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
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const blog = await factory.blogs.insert({ state: BlogState.DRAFT });

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
      const { connection, factory, authenticatedClient } = await getTestFixtures();

      const firstBlog = await factory.blogs.insert();
      const secondBlog = await factory.blogs.insert();

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
  });
});
