import type { Router } from "express";

import { secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import changeBlogState from "src/services/blogs/changeBlogState";
import editBlog from "src/services/blogs/editBlog";
import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";
import ResourceNotFoundError from "src/utility/errors/ResourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function putBlogById(blogs: Router) {
  blogs.put(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const { blogId } = request.params;
        const oldBlog = await selectBlog(transaction, blogId);
        if (oldBlog === null) {
          throw new ResourceNotFoundError({ resourceType: "blog", resourceId: blogId });
        }

        if (oldBlog.authorId !== request.user.id) {
          throw new APIError(
            403,
            "FORBIDDEN_ACCESS",
            "You do not have permission to edit this blog.",
          );
        }

        const data = parseEditBlogData(request.body);

        const ids = { blogId: request.params.blogId, editorId: request.user.id };

        await editBlog(transaction, ids, data);

        try {
          await changeBlogState(transaction, ids, data.state);
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

export default putBlogById;
