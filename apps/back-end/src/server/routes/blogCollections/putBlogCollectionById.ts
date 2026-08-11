import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogCollectionData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import editBlogCollection from "src/services/blogCollections/mutations/transaction/editBlogCollection";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToSeconds from "src/utility/timeConverters/msToSeconds";

function putBlogCollectionById(blogCollections: Router) {
  blogCollections.put(
    RegExp(`^/(?<blogCollectionId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 5,
      windowMs: msToSeconds(10),
    }),
    handleAuthenticatedEndpointMiddleware<{ blogCollectionId: string }>(
      async (request, response) => {
        const connection = getConnection();
        const data = parseEditBlogCollectionData(request.body, () => {
          return new APIError(
            400,
            "INVALID_BLOG_COLLECTION_DATA",
            "The blog collection data provided is invalid. Please try again.",
          );
        });
        const { blogCollectionId } = request.params;

        await connection.transaction(async (transaction) => {
          const blogCollection = await selectBlogCollection(transaction, blogCollectionId);

          if (blogCollection?.userId !== request.user.id) {
            throw forbiddenAccessError({ userId: request.user.id });
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
