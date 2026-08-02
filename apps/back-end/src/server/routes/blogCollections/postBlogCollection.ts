import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { parseCreateBlogCollectionData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createBlogCollection from "src/services/blogCollections/mutations/transaction/createBlogCollection";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function postBlogCollection(blogCollections: Router) {
  blogCollections.post(
    "/",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateBlogCollectionData(request.body, () => {
        return new APIError(
          400,
          "INVALID_BLOG_COLLECTION_DATA",
          "The blog collection data provided is invalid. Please try again.",
        );
      });

      await connection.transaction(async (transaction) => {
        const blogCollection = await createBlogCollection(transaction, request.user.id, data);

        response.status(201).send({ id: blogCollection.id });
      });
    }),
  );
}

export default postBlogCollection;
