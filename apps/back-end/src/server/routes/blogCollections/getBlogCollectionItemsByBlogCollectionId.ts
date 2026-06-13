import type { BlogCollectionItemsFilter } from "@lexicon/models";
import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { parseBlogCollectionItemsFilter } from "@lexicon/models";
import z from "zod";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import countBlogCollectionItems from "src/services/blogCollections/countBlogCollectionItems";
import loadBlogCollectionItemSummaries from "src/services/blogCollections/loadBlogCollectionItemSummaries";
import queryBlogCollectionItemIds from "src/services/blogCollections/queryBlogCollectionItemIds";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogCollectionItemsByBlogCollectionId(blogCollections: Router) {
  return blogCollections.param("blogCollectionId", validateUUID).get(
    "/:blogCollectionId/items",
    handleEndpointMiddleware<{ blogCollectionId: string }>(async (request, response) => {
      const connection = getConnection();
      const { blogCollectionId } = request.params;

      const blogCollection = await selectBlogCollection(connection, blogCollectionId);

      if (blogCollection === null) {
        throw resourceNotFoundError("blog-collection", blogCollectionId);
      }

      const parsedFilters = parseBlogCollectionItemsFilter(request.query, (error) => {
        return new APIError(
          400,
          "INVALID_QUERY_STRING",
          `The query string is invalid:\n\n${z.prettifyError(error)}`,
          { query: request.query },
        );
      });

      const filters: BlogCollectionItemsFilter = {
        sortColumn: "itemNumber",
        sortDirection: "desc",
        ...parsedFilters,
      };

      const itemIds = await queryBlogCollectionItemIds(connection, blogCollectionId, filters);
      const count = await countBlogCollectionItems(connection, blogCollectionId);

      const items = await loadBlogCollectionItemSummaries(connection, itemIds);

      response.status(200).send({ items, count });
    }),
  );
}

export default getBlogCollectionItemsByBlogCollectionId;
