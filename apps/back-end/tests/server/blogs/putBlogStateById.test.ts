import type { EditBlogStateData } from "@lexicon/models";

import { CodeError, DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogView } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";

describe("PUT /api/v1/blogs/<blogId>/state", () => {
  test("Updates the state of the blog", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const author = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision({ author });
    const data: EditBlogStateData = { state: BlogState.ARCHIVED };

    await authenticatedClient.put(`/api/v1/blogs/${blog.id}/state`).send(data).expect(200);

    const { body } = await authenticatedClient.get(`/api/v1/blogs/${blog.id}`).expect(200);

    const blogView = parseBlogView(body.blog);
    expect(blogView.state).toBe(data.state);
  });
  test("Responds with a 404 error if the blog does not exist", async () => {
    const fixtures = new TestFixtures();

    const authenticatedClient = await fixtures.authenticatedClient;

    const missingId = randomUUID();

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${missingId}/state`)
      .send({ state: BlogState.ARCHIVED })
      .expect(404);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceType).toBe("blog");
    expect(error.data.resourceId).toBe(missingId);
  });
  test("Responds with a 403 if trying to edit a blog not owned by the current user", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/state`)
      .send({ state: BlogState.ARCHIVED })
      .expect(403);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
  });
});
