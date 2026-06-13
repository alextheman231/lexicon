import type { ResourceNotFoundErrorPayload } from "src/utility/errors/resourceNotFoundError";

import { assertNotUndefined, fillArray, paralleliseArrays } from "@alextheman/utility";
import { CodeError, DataError } from "@alextheman/utility/v6";
import { parseBlogRevisionHistory } from "@lexicon/models";
import request from "supertest";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import app from "src/server/app";

describe("GET /api/v1/blogs/<blogId>/revisions", () => {
  test("Gets all the blog revisions for the chosen blog", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blog = await factory.blogs.insert({ author: authenticatedUser });
    const factoryRevisions = (
      await fillArray(
        async () => {
          return await factory.blogRevisions.insert({ blog, editor: authenticatedUser });
        },
        10,
        { sequential: true },
      )
    ).toSorted((first, second) => {
      return second.version - first.version;
    });

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}/revisions`)
      .expect(200);

    const apiRevisions = parseBlogRevisionHistory(body.revisions);
    expect(apiRevisions.length).toBe(10);
    expect(factoryRevisions.length).toBe(10);

    for (const [apiRevision, factoryRevision] of paralleliseArrays(
      apiRevisions,
      factoryRevisions,
    )) {
      assertNotUndefined(factoryRevision);
      expect(apiRevision).toMatchObject(factoryRevision);
    }
  });
  test("Can not get blog revisions for a blog the user does not own", async () => {
    const { factory, authenticatedClient } = await getTestFixtures();

    const { blog } = await factory.blogs.insertWithRevision();

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${blog.id}/revisions`)
      .expect(403);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
  });
  test("Returns a 404 error if the blog was not found", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const missingId = randomUUID();

    const { body } = await authenticatedClient
      .get(`/api/v1/blogs/${missingId}/revisions`)
      .expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(missingId);
    expect(error.data.resourceType).toBe("blog");
  });
  test("Does not allow an unauthenticated user to view blog revisions", async () => {
    const { factory } = await getTestFixtures();

    const { blog } = await factory.blogs.insertWithRevision();

    const { body } = await request(app).get(`/api/v1/blogs/${blog.id}/revisions`).expect(401);

    const error = CodeError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("AUTH_REQUIRED");
  });
  test("Errors with 400 on invalid UUID", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const { body } = await authenticatedClient.get("/api/v1/blogs/invalid/revisions").expect(400);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("INVALID_UUID");
    expect(error.data.input).toBe("invalid");
  });
});
