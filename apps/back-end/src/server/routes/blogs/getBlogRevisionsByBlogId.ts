import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import loadBlogRevisions from "src/services/blogs/views/loadBlogRevisions";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToSeconds from "src/utility/timeConverters/msToSeconds";

function getBlogRevisionsByBlogId(blogs: Router) {
  blogs.get<{ blogId: string }>(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})/revisions$`),
    handleRateLimit({
      limit: 10,
      windowMs: msToSeconds(10),
    }),
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

export default getBlogRevisionsByBlogId;
