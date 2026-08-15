import type { Router } from "express";

import { secondsToMs } from "@alextheman/utility";
import { BlogState, parseBlogsFilter } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import countBlogs from "src/services/blogs/views/countBlogs";
import loadBlogSummaries from "src/services/blogs/views/loadBlogSummaries";
import queryBlogIds from "src/services/blogs/views/queryBlogIds";
import forbiddenAccessError from "src/utility/errors/forbiddenAccessError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";

function getBlogs(blogs: Router) {
  blogs.get(
    "/",
    handleRateLimit({
      limit: 30,
      windowMs: secondsToMs(10),
    }),
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const parsedFilters = parseBlogsFilter(request.query);

      if (
        ([BlogState.ARCHIVED, BlogState.DRAFT] as Array<BlogState | undefined>).includes(
          parsedFilters.state,
        ) &&
        parsedFilters.authorId !== request.user?.id
      ) {
        throw forbiddenAccessError({ userId: request.user?.id });
      }

      const filters = { ...parsedFilters, state: parsedFilters.state ?? BlogState.PUBLISHED };

      const blogIds = await queryBlogIds(connection, filters);
      const count = await countBlogs(connection, {
        authorId: filters.authorId,
        state: filters.state,
      });

      const blogs = await loadBlogSummaries(connection, blogIds);
      response.status(200).send({ blogs, count });
    }),
  );
}

export default getBlogs;
