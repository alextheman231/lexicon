import type { Router } from "express";

import type { ResourceNotFoundErrorPayload } from "src/utility/errors/resourceNotFoundError";

import { secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parsePutBlogToBlogCollectionsData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlogCollections from "src/models/blogCollections/selectBlogCollections";
import selectBlog from "src/models/blogs/selectBlog";
import setBlogCollectionsForBlog from "src/services/blogCollections/mutations/transaction/setBlogCollectionsForBlog";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putBlogToBlogCollections(blogs: Router) {
  blogs.put(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})/blog-collections`),
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
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

        try {
          await setBlogCollectionsForBlog(transaction, request.params.blogId, blogCollectionIds);
          response.status(200).send({});
        } catch (error) {
          if (DataError.checkWithCode<ResourceNotFoundErrorPayload>(error, "RESOURCE_NOT_FOUND")) {
            throw resourceNotFoundError(error.data.resourceType, error.data.resourceId);
          } else {
            throw error;
          }
        }
      });
    }),
  );
}

export default putBlogToBlogCollections;
