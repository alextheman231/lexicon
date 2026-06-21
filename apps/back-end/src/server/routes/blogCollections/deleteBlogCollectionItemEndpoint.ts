import type { Router } from "express";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import removeBlogCollectionItem from "src/services/blogCollections/mutations/transaction/removeBlogCollectionItem";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function deleteBlogCollectionItemEndpoint(blogCollections: Router) {
  blogCollections
    .param("blogCollectionId", validateUUID)
    .param("blogCollectionItemId", validateUUID)
    .delete(
      "/:blogCollectionId/items/:blogCollectionItemId",
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

          const wasDeleted = await removeBlogCollectionItem(
            transaction,
            blogCollectionId,
            blogCollectionItemId,
          );
          if (!wasDeleted) {
            throw resourceNotFoundError("blog-collection-item", blogCollectionItemId);
          }

          response.status(204).send({});
        });
      }),
    );
}

export default deleteBlogCollectionItemEndpoint;
