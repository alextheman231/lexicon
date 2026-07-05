import type { Router } from "express";

import { pickProperties } from "@alextheman/utility";
import { parseBlogCollectionsFilter } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import countBlogCollections from "src/services/blogCollections/views/countBlogCollections";
import loadBlogCollections from "src/services/blogCollections/views/loadBlogCollections";
import queryBlogCollectionIds from "src/services/blogCollections/views/queryBlogCollectionIds";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getBlogCollections(blogCollections: Router) {
  blogCollections.get(
    "/",
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const filters = parseBlogCollectionsFilter(request.query);

      const blogCollectionIds = await queryBlogCollectionIds(connection, filters);
      const count = await countBlogCollections(connection, pickProperties(filters, "userId"));

      const blogCollections = await loadBlogCollections(connection, blogCollectionIds);
      response.status(200).send({ blogCollections, count });
    }),
  );
}

export default getBlogCollections;
