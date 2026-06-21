import type { Router } from "express";

import { getConnection } from "src/database/connection";
import loadBlogCollectionView from "src/services/blogCollections/views/loadBlogCollectionView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogCollectionById(blogCollections: Router) {
  blogCollections.param("blogCollectionId", validateUUID).get(
    "/:blogCollectionId",
    handleEndpointMiddleware<{ blogCollectionId: string }>(async (request, response) => {
      const connection = getConnection();
      const { blogCollectionId } = request.params;

      const blogCollection = await loadBlogCollectionView(connection, blogCollectionId);

      if (blogCollection === null) {
        throw resourceNotFoundError("blog-collection", blogCollectionId);
      }

      response.status(200).send({ blogCollection });
    }),
  );
}

export default getBlogCollectionById;
