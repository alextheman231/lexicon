import type { Router } from "express";

import { az, secondsToMs, UUID_REGEX_PATTERN } from "@alextheman/utility";
import { blogQueryStringSchema, BlogState } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import findLatestBlogVersion from "src/services/blogs/findLatestBlogVersion";
import loadBlogView from "src/services/blogs/loadBlogView";
import InvalidQueryStringError from "src/utility/errors/InvalidQueryStringError";
import ResourceNotFoundError from "src/utility/errors/ResourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function getBlogById(blogs: Router) {
  blogs.get(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      const { revisionNumber } = az.with(blogQueryStringSchema).parse(request.query, (error) => {
        return new InvalidQueryStringError({ query: request.query }, error);
      });
      const { blogId } = request.params;

      const blog = await loadBlogView(connection, { blogId, revisionNumber });

      if (blog === null) {
        throw new ResourceNotFoundError({ resourceType: "blog", resourceId: blogId });
      }

      if (
        ([BlogState.ARCHIVED, BlogState.DRAFT] as Array<BlogState>).includes(blog.state) &&
        blog.authorId !== request.user?.id
      ) {
        throw new ResourceNotFoundError({ resourceType: "blog", resourceId: blogId });
      }

      const currentVersion = await findLatestBlogVersion(connection, blogId);
      if (currentVersion !== blog.revisionNumber && request.user?.id !== blog.authorId) {
        throw new ResourceNotFoundError({ resourceType: "blog", resourceId: blogId });
      }

      response.status(200).send({ blog });
    }),
  );
}

export default getBlogById;
