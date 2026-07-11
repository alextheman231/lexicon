import type { ResourceNotFoundErrorPayload } from "src/utility/errors/resourceNotFoundError";

import { az, fillArray, omitProperties } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { blogCollectionViewSchema } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/blog-collections/:blogCollectionId", () => {
  test("Returns the blog collection with the given ID", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const blogCollection = await factory.blogCollections.insert({ user });
    await fillArray(
      async () => {
        return await factory.blogCollectionItems.insert({ blogCollection });
      },
      3,
      { sequential: true },
    );

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollection.id}`)
      .expect(200);

    const blogCollectionView = az.with(blogCollectionViewSchema).parse(body.blogCollection);

    expect(
      omitProperties(blogCollectionView, ["itemCount", "username", "userDisplayName"]),
    ).toMatchObject(blogCollection);
    expect(blogCollectionView.username).toBe(user.username);
    expect(blogCollectionView.userDisplayName).toBe(user.displayName);
    expect(blogCollectionView.itemCount).toBe(3);
  });
  test("Returns a 404 error if the collection does not exist", async () => {
    const missingId = randomUUID();

    const { body } = await testClient.get(`/api/v1/blog-collections/${missingId}`).expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(missingId);
    expect(error.data.resourceType).toBe("blog-collection");
  });
});
