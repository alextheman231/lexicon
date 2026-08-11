import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { BlogState, parseCreateBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createBlog from "src/services/blogs/mutations/transaction/createBlog";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToSeconds from "src/utility/timeConverters/msToSeconds";

function postBlogs(blogs: Router) {
  blogs.post(
    "/",
    handleRateLimit({
      limit: 5,
      windowMs: msToSeconds(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const data = parseCreateBlogData(request.body);

        if (data.state === BlogState.ARCHIVED) {
          throw new APIError(
            400,
            "INVALID_BLOG_DATA",
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
