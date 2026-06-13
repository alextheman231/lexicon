import type { CreateBlogCollectionData } from "src/services/blogCollections/helpers/CreateBlogCollectionData";

import { assertNotNullable, omitProperties, parseUUID } from "@alextheman/utility";
import { parseBlogCollectionItemsResponse, parseBlogCollectionView } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import getTestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

describe("POST /api/v1/blog-collections", () => {
  test("Inserts a bare blog collection to the database if no items specified", async () => {
    const { authenticatedClient, authenticatedUser } = await getTestFixtures();

    const data: CreateBlogCollectionData = {
      name: "Favourites",
      description: "My favourite blogs",
    };

    const { body: postBody } = await authenticatedClient
      .post("/api/v1/blog-collections")
      .send(data)
      .expect(201);
    expect(postBody).toHaveProperty("id");
    const blogCollectionId = parseUUID(postBody.id);

    const { body } = await testClient
      .get(`/api/v1/blog-collections/${blogCollectionId}`)
      .expect(200);
    const blogCollection = parseBlogCollectionView(body.blogCollection);

    expect(blogCollection).toMatchObject(data);
    expect(blogCollection.userId).toBe(authenticatedUser.id);
    expect(blogCollection.itemCount).toBe(0);
  });
  test("Inserts blog collection items if items specified", async () => {
    const { factory, authenticatedClient, authenticatedUser } = await getTestFixtures();

    const { blog: firstBlog } = await factory.blogs.insertWithRevision();
    const { blog: secondBlog } = await factory.blogs.insertWithRevision();

    const data: CreateBlogCollectionData = {
      name: "Favourites",
      description: "My favourite blogs",
      items: [{ blogId: firstBlog.id }, { blogId: secondBlog.id }],
    };

    const { body: postBody } = await authenticatedClient
      .post("/api/v1/blog-collections")
      .send(data)
      .expect(201);
    expect(postBody).toHaveProperty("id");
    const blogCollectionId = parseUUID(postBody.id);

    const { body: collectionBody } = await testClient
      .get(`/api/v1/blog-collections/${blogCollectionId}`)
      .expect(200);
    const blogCollection = parseBlogCollectionView(collectionBody.blogCollection);

    expect(omitProperties(blogCollection, "itemCount")).toMatchObject(
      omitProperties(data, "items"),
    );
    expect(blogCollection.userId).toBe(authenticatedUser.id);
    expect(blogCollection.itemCount).toBe(2);

    const { body: itemsBody } = await testClient
      .get(`/api/v1/blog-collections/${blogCollectionId}/items`)
      .expect(200);
    const { items } = parseBlogCollectionItemsResponse(itemsBody);

    assertNotNullable(data.items);
    const initialItemsBlogIds = data.items.map((item) => {
      return item.blogId;
    });
    for (const item of items) {
      expect(initialItemsBlogIds).toContain(item.blogId);
    }
  });
});
