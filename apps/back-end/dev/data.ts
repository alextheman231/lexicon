import { az, omitProperties } from "@alextheman/utility";
import { AuthProvider, BlogState } from "@lexicon/models";
import DataFactory from "factory";
import BlogFactory from "factory/blogs";
import { Pool } from "pg";
import z from "zod";

import { getConnection } from "src/database/connection";

import blogs from "dev/fixtures/blogs.json" with { type: "json" };
import users from "dev/fixtures/users.json" with { type: "json" };

(async () => {
  const connection = getConnection();
  try {
    const factory = DataFactory.create(connection);

    for (const user of users) {
      const createdUser = await factory.users.insert({
        ...omitProperties(user, "authProviders"),
        dateOfBirth: new Date(user.dateOfBirth),
      });
      for (const authProvider of user.authProviders) {
        await factory.authProviders.insert({
          user: createdUser.id,
          provider: az.with(z.enum(AuthProvider)).parse(authProvider.provider),
          providerUserId: authProvider.providerUserId,
        });
      }
    }

    for (const blog of blogs) {
      await factory.blogs.insertWithRevision({
        ...omitProperties(blog, ["authorId", "content", "state"]),
        author: blog.authorId,
        state: az
          .with(z.enum(omitProperties(BlogState, "ARCHIVED")))
          .parse(blog.state.toLowerCase()),
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
