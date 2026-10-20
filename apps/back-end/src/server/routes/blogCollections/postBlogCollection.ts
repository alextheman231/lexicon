import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";
import { parseCreateBlogCollectionData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import InvalidBlogCollectionDataError from "src/server/routes/blogCollections/helpers/InvalidBlogCollectionDataError";
import createBlogCollection from "src/services/blogCollections/createBlogCollection";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function postBlogCollection(blogCollections: Router) {
  blogCollections.post(
    "/",
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      const data = parseCreateBlogCollectionData(request.body, (error) => {
        return new InvalidBlogCollectionDataError({ input: request.body }, error);
      });

      await connection.transaction(async (transaction) => {
        const blogCollection = await createBlogCollection(transaction, request.user.id, data);

        response.status(201).send({ id: blogCollection.id });
      });
    }),
  );
}

export default postBlogCollection;
