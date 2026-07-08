import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import loadBlogCollectionView from "src/services/blogCollections/views/loadBlogCollectionView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getBlogCollectionById(blogCollections: Router) {
  blogCollections.get(
    RegExp(`^/(?<blogCollectionId>${UUID_REGEX_PATTERN})$`),
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
