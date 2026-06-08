import type { Router } from "express";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import loadBlogRevisions from "src/services/blogs/loadBlogRevisions";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogRevisionByBlogId(blogs: Router) {
  blogs.param("blogId", validateUUID).get<{ blogId: string }>(
    "/:blogId/revisions",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const { blogId } = request.params;

      const blog = await selectBlog(connection, blogId);

      if (blog === null) {
        throw resourceNotFoundError("blog", blogId);
      }

      if (blog.authorId !== request.user.id) {
        throw forbiddenAccessError({ userId: request.user.id });
      }

      const revisions = await loadBlogRevisions(connection, { blogId });

      response.status(200).send({ revisions });
    }),
  );
}

export default getBlogRevisionByBlogId;
