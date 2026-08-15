import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import removeBlogCollectionItem from "src/services/blogCollections/mutations/transaction/removeBlogCollectionItem";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import secondsToMs from "src/utility/timeConverters/secondsToMs";

function deleteBlogCollectionItemEndpoint(blogCollections: Router) {
  blogCollections.delete(
    RegExp(
      `^/(?<blogCollectionId>${UUID_REGEX_PATTERN})/items/(?<blogCollectionItemId>${UUID_REGEX_PATTERN})$`,
    ),
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware<{
      blogCollectionId: string;
      blogCollectionItemId: string;
    }>(async (request, response) => {
      const connection = getConnection();
      const { blogCollectionId, blogCollectionItemId } = request.params;

      await connection.transaction(async (transaction) => {
        const blogCollection = await selectBlogCollection(transaction, blogCollectionId);
        if (blogCollection === null) {
          throw resourceNotFoundError("blog-collection", blogCollectionId);
        }

        if (blogCollection.userId !== request.user.id) {
          throw forbiddenAccessError({ userId: request.user.id });
        }

        const wasDeleted = await removeBlogCollectionItem(transaction, blogCollectionId, {
          blogCollectionItemId,
        });
        if (!wasDeleted) {
          throw resourceNotFoundError("blog-collection-item", blogCollectionItemId);
        }

        response.status(204).send({});
      });
    }),
  );
}

export default deleteBlogCollectionItemEndpoint;
