import { assertNotUndefined, fillArray } from "@alextheman/utility";
import { parseBlogCollectionOptions } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("GET /api/v1/blog-collections/options", () => {
  test("Returns the ID and name of each blog collection.", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const testClient = await fixtures.authenticatedClient;

    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      10,
      { sequential: true },
    );
    const otherCollection = await factory.blogCollections.insert();

    const { body } = await testClient.get("/api/v1/blog-collections/options").expect(200);
    const options = parseBlogCollectionOptions(body.options);

    expect(options.length).toBe(10);

    for (const option of options) {
      expect(Object.keys(option).length).toBe(2);
      expect(option.id).not.toBe(otherCollection.id);

      const blogCollection = blogCollections.find((collection) => {
        return collection.id === option.id;
      });
      assertNotUndefined(blogCollection);

      expect(option.id).toBe(blogCollection.id);
      expect(option.name).toBe(blogCollection.name);
    }
  });
});
