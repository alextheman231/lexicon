import type { Router } from "express";

import { secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import loadBlogRevisions from "src/services/blogs/loadBlogRevisions";
import ForbiddenAccessError from "src/utility/errors/ForbiddenAccessError";
import ResourceNotFoundError from "src/utility/errors/ResourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function getBlogRevisionsByBlogId(blogs: Router) {
  blogs.get<{ blogId: string }>(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})/revisions$`),
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const { blogId } = request.params;

      const blog = await selectBlog(connection, blogId);

      if (blog === null) {
        throw new ResourceNotFoundError({ resourceType: "blog", resourceId: blogId });
      }

      if (blog.authorId !== request.user.id) {
        throw new ForbiddenAccessError({ userId: request.user.id });
      }

      const revisions = await loadBlogRevisions(connection, { blogId });

      response.status(200).send({ revisions });
    }),
  );
}

export default getBlogRevisionsByBlogId;
