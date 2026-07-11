import type { BlogCollectionsFilter } from "@lexicon/models";

import { assertNotUndefined, fillArray } from "@alextheman/utility";
import { parseBlogCollectionsResponse } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/blog-collections", () => {
  test("Returns an array of all blog collections", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert();
      },
      10,
      { sequential: true },
    );

    const { body } = await testClient.get("/api/v1/blog-collections").expect(200);
    const { blogCollections: returnedCollections, count } = parseBlogCollectionsResponse(body);
    expect(count).toBe(10);
    expect(returnedCollections.length).toBe(10);

    for (const collection of returnedCollections) {
      const factoryCollection = blogCollections.find((factoryCollection) => {
        return factoryCollection.id === collection.id;
      });
      assertNotUndefined(factoryCollection);
      expect(collection).toMatchObject(factoryCollection);
    }
  });
  test("Can filter by user", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      5,
      { sequential: true },
    );
    const otherBlogCollection = await factory.blogCollections.insert();
    const factoryCollectionIds = blogCollections.map((collection) => {
      return collection.id;
    });

    const filters: BlogCollectionsFilter = {
      userId: user.id,
    };

    const { body } = await testClient.get("/api/v1/blog-collections").query(filters).expect(200);
    const { blogCollections: returnedCollections, count } = parseBlogCollectionsResponse(body);
    expect(returnedCollections.length).toBe(5);
    expect(count).toBe(5);

    for (const collection of returnedCollections) {
      expect(collection.id).not.toBe(otherBlogCollection.id);
      expect(collection.userId).toBe(user.id);
      expect(factoryCollectionIds).toContain(collection.id);
    }
  });
});
