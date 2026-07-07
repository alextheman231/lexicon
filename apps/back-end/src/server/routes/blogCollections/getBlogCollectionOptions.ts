import type { Router } from "express";

import { getConnection } from "src/database/connection";
import fetchBlogCollectionOptions from "src/server/routes/blogCollections/helpers/fetchBlogCollectionOptions";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function getBlogCollectionOptions(blogCollections: Router) {
  blogCollections.get(
    "/options",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const options = await fetchBlogCollectionOptions(connection, { userId: request.user.id });

      response.status(200).send({ options });
    }),
  );
}

export default getBlogCollectionOptions;
