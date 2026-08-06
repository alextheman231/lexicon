import { fillArray } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlogCollectionItemsResponse } from "@lexicon/models";
import { describe, expect, test } from "vitest";

import TestFixtures from "tests/fixtures";

describe("PUT /blogs/<blogId>/blog-collections", () => {
  test("Adds a blog to a list of blog collections.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();
    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      3,
      { sequential: true },
    );
    const blogCollectionIds = blogCollections.map((collection) => {
      return collection.id;
    });

    await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds })
      .expect(200);

    for (const blogCollectionId of blogCollectionIds) {
      const { body } = await authenticatedClient
        .get(`/api/v1/blog-collections/${blogCollectionId}/items`)
        .expect(200);
      const { items, count } = parseBlogCollectionItemsResponse(body);

      expect(count).toBe(1);
      expect(items.length).toBe(1);

      const [item] = items;

      expect(item.blogId).toBe(blog.id);
    }
  });
  test("Accounts for blog collections already containing the blog.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();

    const blogCollection = await factory.blogCollections.insert({ user });
    await factory.blogCollectionItems.insert({ blogCollection, blog });

    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      3,
      { sequential: true },
    );

    const blogCollectionIds = [
      blogCollection.id,
      ...blogCollections.map((collection) => {
        return collection.id;
      }),
    ];

    await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds })
      .expect(200);

    for (const blogCollectionId of blogCollectionIds) {
      const { body } = await authenticatedClient
        .get(`/api/v1/blog-collections/${blogCollectionId}/items`)
        .expect(200);
      const { items, count } = parseBlogCollectionItemsResponse(body);

      expect(count).toBe(1);
      expect(items.length).toBe(1);

      const [item] = items;

      expect(item.blogId).toBe(blog.id);
    }
  });
  test("Removes a blog from a collection if it's already part of a collection that was not specified.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();

    const blogCollection = await factory.blogCollections.insert({ user });
    await factory.blogCollectionItems.insert({ blogCollection, blog });

    const blogCollections = await fillArray(
      async () => {
        return await factory.blogCollections.insert({ user });
      },
      3,
      { sequential: true },
    );
    const blogCollectionIds = blogCollections.map((collection) => {
      return collection.id;
    });

    await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds })
      .expect(200);

    const { body } = await authenticatedClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);
    const { items, count } = parseBlogCollectionItemsResponse(body);

    expect(count).toBe(0);
    expect(items.length).toBe(0);

    for (const blogCollectionId of blogCollectionIds) {
      const { body } = await authenticatedClient
        .get(`/api/v1/blog-collections/${blogCollectionId}/items`)
        .expect(200);
      const { items, count } = parseBlogCollectionItemsResponse(body);

      expect(count).toBe(1);
      expect(items.length).toBe(1);

      const [item] = items;

      expect(item.blogId).toBe(blog.id);
    }
  });
  test("Empty array removes the blog from all collections", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();

    const blogCollectionIds = await fillArray(
      async () => {
        const blogCollection = await factory.blogCollections.insert({ user });
        await factory.blogCollectionItems.insert({ blogCollection, blog });
        return blogCollection.id;
      },
      3,
      { sequential: true },
    );

    await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds: [] })
      .expect(200);

    for (const blogCollectionId of blogCollectionIds) {
      const { body } = await authenticatedClient
        .get(`/api/v1/blog-collections/${blogCollectionId}/items`)
        .expect(200);
      const { items, count } = parseBlogCollectionItemsResponse(body);

      expect(count).toBe(0);
      expect(items.length).toBe(0);
    }
  });
  test("Allows adding a user's own draft blog.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision({
      state: BlogState.DRAFT,
      author: user,
    });
    const blogCollection = await factory.blogCollections.insert({ user });

    await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds: [blogCollection.id] })
      .expect(200);

    const { body } = await authenticatedClient
      .get(`/api/v1/blog-collections/${blogCollection.id}/items`)
      .expect(200);
    const { items, count } = parseBlogCollectionItemsResponse(body);

    expect(count).toBe(1);
    expect(items.length).toBe(1);

    const [item] = items;

    expect(item.blogId).toBe(blog.id);
  });
  test("Does not allow adding a blog to a collection that does not belong to the current user.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision();
    const blogCollection = await factory.blogCollections.insert();

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds: [blogCollection.id] })
      .expect(403);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
    expect(error.data.userId).toBe(user.id);
  });
  test("Does not allow adding another user's draft blog.", async () => {
    const fixtures = new TestFixtures();
    const factory = await fixtures.factory;
    const user = await fixtures.authenticatedUser;
    const authenticatedClient = await fixtures.authenticatedClient;

    const { blog } = await factory.blogs.insertWithRevision({ state: BlogState.DRAFT });
    const blogCollection = await factory.blogCollections.insert({ user });

    const { body } = await authenticatedClient
      .put(`/api/v1/blogs/${blog.id}/blog-collections`)
      .send({ blogCollectionIds: [blogCollection.id] })
      .expect(403);

    const error = DataError.expectError(() => {
      throw body.error;
    });

    expect(error.code).toBe("FORBIDDEN_ACCESS");
    expect(error.data.userId).toBe(user.id);
  });
});
