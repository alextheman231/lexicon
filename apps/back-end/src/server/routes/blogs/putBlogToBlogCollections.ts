import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { BlogState, parsePutBlogToBlogCollectionsData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlogCollections from "src/models/blogCollections/selectBlogCollections";
import selectBlog from "src/models/blogs/selectBlog";
import setBlogCollectionsForBlog from "src/services/blogCollections/mutations/transaction/setBlogCollectionsForBlog";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putBlogToBlogCollections(blogs: Router) {
  blogs.put(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})/blog-collections`),
    handleAuthenticatedEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      const { blogCollectionIds } = parsePutBlogToBlogCollectionsData(request.body);

      await connection.transaction(async (transaction) => {
        const blogCollections = await selectBlogCollections(transaction, blogCollectionIds);
        const blog = await selectBlog(transaction, request.params.blogId);

        for (const blogCollection of blogCollections) {
          if (
            blogCollection.userId !== request.user.id ||
            (blog?.state === BlogState.DRAFT && blog?.authorId !== request.user.id)
          ) {
            throw forbiddenAccessError({ userId: request.user.id });
          }
        }

        await setBlogCollectionsForBlog(transaction, request.params.blogId, blogCollectionIds);
        response.status(200).send({});
      });
    }),
  );
}

export default putBlogToBlogCollections;
