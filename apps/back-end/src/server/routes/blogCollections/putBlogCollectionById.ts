import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import { parseEditBlogCollectionData } from "src/services/blogCollections/helpers/EditBlogCollectionData";
import editBlogCollection from "src/services/blogCollections/mutations/transaction/editBlogCollection";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putBlogCollectionById(blogCollections: Router) {
  blogCollections.put(
    RegExp(`^/(?<blogCollectionId>${UUID_REGEX_PATTERN})$`),
    handleAuthenticatedEndpointMiddleware<{ blogCollectionId: string }>(
      async (request, response) => {
        const connection = getConnection();
        const data = parseEditBlogCollectionData(request.body);
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
