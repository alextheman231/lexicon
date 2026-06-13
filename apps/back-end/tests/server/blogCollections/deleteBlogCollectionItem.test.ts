import type { ResourceNotFoundErrorPayload } from "src/utility/errors/resourceNotFoundError";

import { fillArray, paralleliseArrays, range, sortBy } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { parseBlogCollectionItemsResponse } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import { randomUUID } from "node:crypto";

import getTestFixtures from "tests/fixtures";

import loadBlogCollectionItemsByBlogCollectionId from "src/services/blogCollections/loadBlogCollectionItemsByBlogCollectionId";

describe("DELETE /api/v1/blog-collections/<blogCollectionId>/items/<itemNumber>", () => {
  test("Deletes a blog collection item from the collection", async () => {
    const { connection, factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blogCollection = await factory.blogCollections.insert({ user: authenticatedUser });
    const itemToKeep = await factory.blogCollectionItems.insert({ blogCollection });
    const itemToDelete = await factory.blogCollectionItems.insert({ blogCollection });

    const { body: getBeforeDeleteBody } = await authenticatedClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);
    const beforeDelete = parseBlogCollectionItemsResponse(getBeforeDeleteBody);

    expect(beforeDelete.items.length).toBe(2);
    expect(beforeDelete.count).toBe(2);

    const idsBeforeDelete = beforeDelete.items.map((item) => {
      return item.id;
    });

    expect(idsBeforeDelete).toContain(itemToKeep.id);
    expect(idsBeforeDelete).toContain(itemToDelete.id);

    await authenticatedClient
      .delete(`/api/v1/blog-collections/${blogCollection.id}/items/${itemToDelete.id}`)
      .expect(204);

    // Assert the item does not get returned in responses
    const { body: getAfterDeleteBody } = await authenticatedClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);
    const afterDelete = parseBlogCollectionItemsResponse(getAfterDeleteBody);

    expect(afterDelete.items.length).toBe(1);
    expect(afterDelete.count).toBe(1);

    const idsAfterDelete = afterDelete.items.map((item) => {
      return item.id;
    });

    expect(idsAfterDelete).toContain(itemToKeep.id);
    expect(idsAfterDelete).not.toContain(itemToDelete.id);

    // Assert the item is not even persisted in the database (even if the response may conveniently leave it out even though it is still there)
    const itemsDirectlyFromDatabase = await loadBlogCollectionItemsByBlogCollectionId(
      connection,
      blogCollection.id,
    );
    const idsFromDatabase = itemsDirectlyFromDatabase.map((item) => {
      return item.id;
    });

    expect(idsFromDatabase).toContain(itemToKeep.id);
    expect(idsFromDatabase).not.toContain(itemToDelete.id);
  });
  test("Returns 404 if the blog collection itself does not exist", async () => {
    const { authenticatedClient } = await getTestFixtures();

    const missingId = randomUUID();
    const missingItemId = randomUUID();

    const { body } = await authenticatedClient
      .delete(`/api/v1/blog-collections/${missingId}/items/${missingItemId}`)
      .expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(missingId);
    expect(error.data.resourceType).toBe("blog-collection");
  });
  test("Returns 404 if the blog collection item does not exist", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blogCollection = await factory.blogCollections.insert({ user: authenticatedUser });
    const missingItemId = randomUUID();

    const { body } = await authenticatedClient
      .delete(`/api/v1/blog-collections/${blogCollection.id}/items/${missingItemId}`)
      .expect(404);

    const error = DataError.expectError<ResourceNotFoundErrorPayload>(() => {
      throw body.error;
    });

    expect(error.code).toBe("RESOURCE_NOT_FOUND");
    expect(error.data.resourceId).toBe(missingItemId);
    expect(error.data.resourceType).toBe("blog-collection-item");
  });
  test("Does not allow deletion of an item from another user's blog collection", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blogCollection = await factory.blogCollections.insert();
    const blogCollectionItem = await factory.blogCollectionItems.insert({ blogCollection });

    const { body } = await authenticatedClient
      .delete(`/api/v1/blog-collections/${blogCollection.id}/items/${blogCollectionItem.id}`)
      .expect(403);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
    expect(error.data.userId).toBe(authenticatedUser.id);
  });
  test("Adjusts item numbers correctly", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const blogCollection = await factory.blogCollections.insert({ user: authenticatedUser });
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

    // eslint-disable-next-line prefer-destructuring -- I don't think destructuring particularly helps with readability in this case.
    const itemToDelete = blogCollectionItems[5];

    await authenticatedClient
      .delete(`/api/v1/blog-collections/${blogCollection.id}/items/${itemToDelete.id}`)
      .expect(204);

    const { body: getAfterDeleteBody } = await authenticatedClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);
    const afterDelete = parseBlogCollectionItemsResponse(getAfterDeleteBody);

    for (const [item, expectedItemNumber] of paralleliseArrays(
      afterDelete.items,
      range(afterDelete.items.length, 0, -1),
    )) {
      expect(item.itemNumber).toBe(expectedItemNumber);
      expect(item.id).not.toBe(itemToDelete.id);
    }
  });
});
