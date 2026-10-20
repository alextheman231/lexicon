import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";
import { BlogState, parseCreateBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createBlog from "src/services/blogs/createBlog";
import APIError from "src/utility/errors/APIError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import InvalidBlogDataError from "src/server/routes/blogs/helpers/InvalidBlogDataError";

function postBlogs(blogs: Router) {
  blogs.post(
    "/",
    handleRateLimit({
      limit: 5,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const data = parseCreateBlogData(request.body, (error) => {
          return new InvalidBlogDataError({
              input: request.body,
            }, error
          );
        });

        if (data.state === BlogState.ARCHIVED) {
          throw new APIError(
            400,
            "RESOURCE_NOT_IN_REQUIRED_STATE",
            "Cannot create a blog with an initial archived state.",
            { input: data },
          );
        }

        const { id } = await createBlog(transaction, request.user.id, data);
        response.status(201).send({ id });
      });
    }),
  );
}

export default postBlogs;
