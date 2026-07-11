import type { BlogCollectionOptionsQueryString } from "@lexicon/models";

import { assertNotUndefined, fillArray } from "@alextheman/utility";
import { parseBlogCollectionOptions } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("GET /api/v1/blog-collections/options", () => {
  test("Returns the ID, name, and selected of each blog collection.", async () => {
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
      expect(Object.keys(option).length).toBe(3);
      expect(option.id).not.toBe(otherCollection.id);

      const blogCollection = blogCollections.find((collection) => {
        return collection.id === option.id;
      });
      assertNotUndefined(blogCollection);

      expect(option.id).toBe(blogCollection.id);
      expect(option.name).toBe(blogCollection.name);
      expect(option.selected).toBe(false);
    }
  });
  test("Provides a selected boolean property depending on selectedBlogId query", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const testClient = await fixtures.authenticatedClient;

    const unselectedBlogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      5,
      { sequential: true },
    );

    const blog = await factory.blogs.insert();

    const selectedBlogCollections = await fillArray(
      async () => {
        const blogCollection = await factory.blogCollections.insert({ user });
        await factory.blogCollectionItems.insert({ blogCollection, blog });
        return blogCollection;
      },
      3,
      { sequential: true },
    );

    const query: BlogCollectionOptionsQueryString = {
      selectedBlogId: blog.id,
    };

    const { body } = await testClient
      .get("/api/v1/blog-collections/options")
      .query(query)
      .expect(200);
    const options = parseBlogCollectionOptions(body.options);

    expect(options.length).toBe(8);
    const selectedOptions = options.filter((option) => {
      return option.selected;
    });
    const unselectedOptions = options.filter((option) => {
      return !option.selected;
    });

    expect(unselectedOptions.length).toBe(5);
    expect(selectedOptions.length).toBe(3);

    for (const option of selectedOptions) {
      expect(Object.keys(option).length).toBe(3);
      expect(
        unselectedBlogCollections.map((collection) => {
          return collection.id;
        }),
      ).not.toContain(option.id);

      const blogCollection = selectedBlogCollections.find((collection) => {
        return collection.id === option.id;
      });
      assertNotUndefined(blogCollection);

      expect(option.id).toBe(blogCollection.id);
      expect(option.name).toBe(blogCollection.name);
      expect(option.selected).toBe(true);
    }

    for (const option of unselectedOptions) {
      expect(Object.keys(option).length).toBe(3);
      expect(
        selectedBlogCollections.map((collection) => {
          return collection.id;
        }),
      ).not.toContain(option.id);

      const blogCollection = unselectedBlogCollections.find((collection) => {
        return collection.id === option.id;
      });
      assertNotUndefined(blogCollection);

      expect(option.id).toBe(blogCollection.id);
      expect(option.name).toBe(blogCollection.name);
      expect(option.selected).toBe(false);
    }
  });
});
