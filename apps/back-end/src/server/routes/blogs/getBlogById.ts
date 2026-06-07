import type { Router } from "express";

import { getConnection } from "src/database/connection";
import { selectBlogView } from "src/services/blogs";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import validateUUID from "src/utility/validators/validateUUID";

function getBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).get(
    "/:blogId",
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();
      const blog = await selectBlogView(connection, request.params.blogId);

      if (blog === null) {
        throw resourceNotFoundError("blog", request.params.blogId);
      }

      response.status(200).send({ blog });
    }),
  );
}

export default getBlogById;
