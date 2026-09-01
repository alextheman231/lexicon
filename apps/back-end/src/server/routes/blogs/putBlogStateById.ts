import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { APIError, DataError } from "@alextheman/utility/v6";
import { parseEditBlogStateData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import changeBlogState from "src/services/blogs/mutations/transaction/changeBlogState";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function putBlogStateById(blogs: Router) {
  blogs.put(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})/state`),
    handleAuthenticatedEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const oldBlog = await selectBlog(transaction, request.params.blogId);
        if (oldBlog === null) {
          throw resourceNotFoundError("blog", request.params.blogId);
        }

        if (oldBlog.authorId !== request.user.id) {
          throw new APIError(
            403,
            "FORBIDDEN_ACCESS",
            "You do not have permission to edit this blog.",
          );
        }

        const data = parseEditBlogStateData(request.body);

        try {
          await changeBlogState(
            transaction,
            { blogId: request.params.blogId, editorId: request.user.id },
            data.state,
          );
        } catch (error) {
          if (DataError.checkWithCode(error, "INVALID_STATE_TRANSITION")) {
            throw new APIError(400, error.code, error.message, error.data);
          } else {
            throw error;
          }
        }

        response.status(200).send({});
      });
    }),
  );
}

export default putBlogStateById;
