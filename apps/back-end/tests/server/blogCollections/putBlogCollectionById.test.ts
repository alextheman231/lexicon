import type { EditBlogCollectionData } from "@lexicon/models";

import { DataError } from "@alextheman/utility/v6";
import { parseBlogCollectionView } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("PUT /api/v1/blog-collections/<blogCollectionId>", () => {
  test("Updates a given blog collection's metadata if no items provided", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const testClient = await fixtures.authenticatedClient;

    const blogCollection = await factory.blogCollections.insert({ user });

    const data: EditBlogCollectionData = {
      name: "Favourite Blogs",
      description: "My favourite blogs",
    };

    await testClient.put(`/api/v1/blog-collections/${blogCollection.id}`).send(data).expect(200);
    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollection.id}`)
      .expect(200);
    const blogCollectionView = parseBlogCollectionView(body.blogCollection);

    expect(blogCollectionView).toMatchObject(data);
    expect(blogCollectionView.userId).toBe(user.id);
    expect(blogCollectionView.itemCount).toBe(0);
  });
  test("Does not allow users to edit collections that are not theirs", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const testClient = await fixtures.authenticatedClient;
    const user = await fixtures.authenticatedUser;

    const blogCollection = await factory.blogCollections.insert();
    const data: EditBlogCollectionData = {
      name: "Favourite Blogs",
      description: "My favourite blogs",
    };

    const { body } = await testClient
      .put(`/api/v1/blog-collections/${blogCollection.id}`)
      .send(data)
      .expect(403);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
    expect(error.data.userId).toBe(user.id);
  });
});
