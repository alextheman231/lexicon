import type { Router } from "express";

import { getConnection } from "src/database/connection";
import { parseCreateBlogCollectionData } from "src/services/blogCollections/helpers/CreateBlogCollectionData";
import createBlogCollection from "src/services/blogCollections/mutations/transaction/createBlogCollection";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function postBlogCollection(blogCollections: Router) {
  blogCollections.post(
    "/",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateBlogCollectionData(request.body);

      await connection.transaction(async (transaction) => {
        const blogCollection = await createBlogCollection(transaction, request.user.id, data);

        response.status(201).send({ id: blogCollection.id });
      });
    }),
  );
}

export default postBlogCollection;
