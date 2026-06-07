import type { Router } from "express";

import { getConnection } from "src/database/connection";
import loadBlogView from "src/services/blogs/loadBlogView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).get(
    "/:blogId",
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();
      const blog = await loadBlogView(connection, request.params.blogId);

      if (blog === null) {
        throw resourceNotFoundError("blog", request.params.blogId);
      }

      response.status(200).send({ blog });
    }),
  );
}

export default getBlogById;
