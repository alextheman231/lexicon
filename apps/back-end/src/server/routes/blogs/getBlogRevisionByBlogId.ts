import type { Router } from "express";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import loadBlogRevisions from "src/services/blogs/loadBlogRevisions";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import requireAuth from "src/utility/handlers/requireAuth";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogRevisionByBlogId(blogs: Router) {
  blogs.param("blogId", validateUUID).get<{ blogId: string }>(
    "/:blogId/revisions",
    requireAuth,
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const { blogId } = request.params;

      const blog = await selectBlog(connection, blogId);

      if (blog === null) {
        throw resourceNotFoundError("blog", blogId);
      }

      const revisions = await loadBlogRevisions(connection, { blogId });

      response.status(200).send({ revisions });
    }),
  );
}

export default getBlogRevisionByBlogId;
