import type { BlogCollectionItemsFilter } from "@lexicon/models";

import type { ResourceNotFoundErrorPayload } from "src/utility/errors/resourceNotFoundError";

import {
  assertNotNull,
  assertNotUndefined,
  fillArray,
  isSameDate,
  paralleliseArrays,
  sortBy,
} from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseBlogCollectionItemsResponse } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("GET /api/v1/blog-collections/:blogCollectionId/items", () => {
  test("Returns all blog collection items", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const blogCollection = await factory.blogCollections.insert();
    const blogCollectionItems = (
      await fillArray(
        async () => {
          return await factory.blogCollectionItems.insert({ blogCollection });
        },
        10,
        { sequential: true },
      )
    ).toSorted(
      sortBy((item) => {
        return item.itemNumber;
      }, "desc"),
    );

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);

    const { items, count } = parseBlogCollectionItemsResponse(body);
    expect(count).toBe(10);
    expect(items.length).toBe(10);

    for (const [apiItem, factoryItem] of paralleliseArrays(items, blogCollectionItems)) {
      assertNotUndefined(factoryItem);
      expect(factoryItem.id).toBe(apiItem.id);
      expect(factoryItem.blogId).toBe(apiItem.blogId);
      expect(factoryItem.blogCollectionId).toBe(apiItem.blogCollectionId);
      expect(factoryItem.itemNumber).toBe(apiItem.itemNumber);
    }
  });
  test("Takes pagination data through the query string", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const author = await factory.users.insert();
    const blogCollection = await factory.blogCollections.insert();
    const blogCollectionItems = (
      await fillArray(
        async () => {
          const { blog, revision } = await factory.blogs.insertWithRevision({ author });
          return [
            { blog, revision },
            await factory.blogCollectionItems.insert({ blogCollection, blog }),
          ] as const;
        },
        10,
        { sequential: true },
      )
    ).toSorted(
      sortBy(([_, item]) => {
        return item.itemNumber;
      }, "asc"),
    );

    const secondPageItems = blogCollectionItems.slice(5, 10);
    expect(secondPageItems.length).toBe(5);

    const filters: BlogCollectionItemsFilter = {
      pageNumber: 2,
      pageSize: 5,
      sortColumn: "itemNumber",
      sortDirection: "asc",
    };

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .query(filters)
      .expect(200);
    const { items, count } = parseBlogCollectionItemsResponse(body);
    expect(count).toBe(10);
    expect(items.length).toBe(5);

    for (const [[{ blog, revision }, factoryItem], apiItem] of paralleliseArrays(
      secondPageItems,
      items,
    )) {
      assertNotUndefined(apiItem);
      expect(apiItem).toMatchObject(factoryItem);
      expect(apiItem.authorDisplayName).toBe(author.displayName);
      expect(apiItem.authorUsername).toBe(author.username);
      expect(apiItem.blogTitle).toBe(revision.title);

      assertNotNull(apiItem.blogPublishedAt);
      assertNotNull(blog.publishedAt);

      expect(isSameDate(apiItem.blogPublishedAt, blog.publishedAt)).toBe(true);
      expect(isSameDate(apiItem.blogUpdatedAt, blog.updatedAt)).toBe(true);
    }
  });
  test("Returns 404 if the blog collection does not exist", async () => {
    const missingId = randomUUID();

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${missingId}/items`)
      .expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(missingId);
    expect(error.data.resourceType).toBe("blog-collection");
  });
  test("Returns 400 if query string is invalid", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;

    const filters = {
      sortColumn: "invalid",
    };

    const blogCollection = await factory.blogCollections.insert();

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .query(filters)
      .expect(400);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("INVALID_QUERY_STRING");
    expect(error.data.query).toEqual(filters);
  });
});
