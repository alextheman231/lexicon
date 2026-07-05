import { omitProperties } from "@alextheman/utility";
import blogCollectionsFixtures from "dev/fixtures/blogCollections";
import blogsFixtures from "dev/fixtures/blogs";
import usersFixtures from "dev/fixtures/users";
import DataFactory from "factory";
import BlogFactory from "factory/blogs";
import { Pool } from "pg";

import { getConnection } from "src/database/connection";

(async () => {
  const connection = getConnection();
  try {
    const factory = DataFactory.create(connection);

    for (const user of usersFixtures) {
      const createdUser = await factory.users.insert({
        ...omitProperties(user, "authProviders"),
      });
      for (const authProvider of user.authProviders) {
        await factory.authProviders.insert({
          user: createdUser,
          ...authProvider,
        });
      }
    }

    for (const blog of blogsFixtures) {
      await factory.blogs.insertWithRevision({
        ...omitProperties(blog, ["authorId", "content"]),
        author: blog.authorId,
        content: BlogFactory.generateEditorContent(blog.content),
      });
    }

    for (const blogCollection of blogCollectionsFixtures) {
      const createdCollection = await factory.blogCollections.insert({
        ...omitProperties(blogCollection, ["userId", "items"]),
        user: blogCollection.userId,
      });
      for (const [index, item] of blogCollection.items.entries()) {
        await factory.blogCollectionItems.insert({
          ...item,
          blogCollection: createdCollection,
          itemNumber: index + 1,
        });
      }
    }

    console.info("Data loaded successfully!");
  } finally {
    if (connection.$client instanceof Pool) {
      await connection.$client.end();
    }
  }
})();
