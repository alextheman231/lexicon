import { assertNotNull, omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseBlogView } from "@lexicon/models";
import BlogFactory from "factory/blogs";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import selectUser from "src/models/users/selectUser";

describe("GET /api/v1/blogs/<blogId>", () => {
  test("Returns the blog with the given blog ID", async () => {
    const { connection, factory, authenticatedClient } = await getTestFixtures();

    const { blog, revision } = await factory.blogs.insertWithRevision();

    const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

    const blogView = parseBlogView(body.blog);
    expect(blogView).toMatchObject(omitProperties(blog, "currentRevisionId"));

    const user = await selectUser(connection, { userId: blogView.authorId });
    assertNotNull(user);
    expect(blogView.authorDisplayName).toBe(user.displayName);
    expect(blogView.authorUsername).toBe(user.username);

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
  test("Allows for a query string to get a specific blog revision", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const { blog, revision: initialRevision } = await factory.blogs.insertWithRevision({
      author: authenticatedUser,
    });
    await factory.blogRevisions.insert({
      blog,
      title: "New title",
      content: BlogFactory.generateEditorContent("New content"),
    });

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}`)
      .query({ revisionNumber: initialRevision.version })
      .expect(200);
    const revisionView = parseBlogView(body.blog);
    expect(revisionView).toMatchObject(omitProperties(blog, "currentRevisionId"));

    expect(revisionView.authorId).toBe(authenticatedUser.id);
    expect(revisionView.authorDisplayName).toBe(authenticatedUser.displayName);
    expect(revisionView.authorUsername).toBe(authenticatedUser.username);

    expect(revisionView.title).toBe(initialRevision.title);
    expect(revisionView.content).toEqual(initialRevision.content);
  });
  test("Returns 400 for an invalid revision number", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const { blog } = await factory.blogs.insertWithRevision();

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}`)
      .query({ revisionNumber: "invalid" })
      .expect(400);

    const error = DataError.expectError<{ query: { revisionNumber: unknown } }>(() => {
      throw body.error;
    });

    expect(error.code).toBe("INVALID_QUERY_STRING");
    expect(error.data.query.revisionNumber).toBe("invalid");
  });
  test("If querying for a revision that is not the current revision, do not allow anyone other than the current user to access it.", async () => {
    const { factory } = await getTestFixtures();

    const { blog, revision: initialRevision } = await factory.blogs.insertWithRevision();
    await factory.blogRevisions.insert({
      blog,
      title: "New title",
      content: BlogFactory.generateEditorContent("New content"),
    });

    const { body } = await testClient
      .get(`/api/v1/blogs/${blog.id}`)
      .query({ revisionNumber: initialRevision.version })
      .expect(404);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(blog.id);
    expect(error.data.resourceType).toBe("blog");
  });
});
