import type { Router } from "express";

import { parseBlogCollectionOptionsQueryString } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import fetchBlogCollectionOptions from "src/server/routes/blogCollections/helpers/fetchBlogCollectionOptions";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import secondsToMs from "src/utility/timeConverters/secondsToMs";

function getBlogCollectionOptions(blogCollections: Router) {
  blogCollections.get(
    "/options",
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const query = parseBlogCollectionOptionsQueryString(request.query);

      const options = await fetchBlogCollectionOptions(connection, {
        userId: request.user.id,
        selectedBlogId: query.selectedBlogId,
      });

      response.status(200).send({ options });
    }),
  );
}

export default getBlogCollectionOptions;
