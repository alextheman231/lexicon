import type { Router } from "express";

import { secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { parseEditBlogCollectionData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import InvalidBlogCollectionDataError from "src/server/routes/blogCollections/helpers/InvalidBlogCollectionDataError";
import editBlogCollection from "src/services/blogCollections/editBlogCollection";
import ForbiddenAccessError from "src/utility/errors/ForbiddenAccessError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putBlogCollectionById(blogCollections: Router) {
  blogCollections.put(
    RegExp(`^/(?<blogCollectionId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware<{ blogCollectionId: string }>(
      async (request, response) => {
        const connection = getConnection();
        const data = parseEditBlogCollectionData(request.body, (error) => {
          return new InvalidBlogCollectionDataError({input: request.body}, error)
        });
        const { blogCollectionId } = request.params;

        await connection.transaction(async (transaction) => {
          const blogCollection = await selectBlogCollection(transaction, blogCollectionId);

          if (blogCollection?.userId !== request.user.id) {
            throw new ForbiddenAccessError({ userId: request.user.id });
          }

          await editBlogCollection(
            transaction,
            { userId: request.user.id, blogCollectionId },
            data,
          );
        });

        response.status(200).send({});
      },
    ),
  );
}

export default putBlogCollectionById;
