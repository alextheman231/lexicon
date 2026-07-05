import { omitProperties } from "@alextheman/utility";
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
          user: createdUser.id,
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

    console.info("Data loaded successfully!");
  } finally {
    if (connection.$client instanceof Pool) {
      await connection.$client.end();
    }
  }
})();
