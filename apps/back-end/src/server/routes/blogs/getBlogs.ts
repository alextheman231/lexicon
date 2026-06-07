import type { Router } from "express";

import { parseBlogFilter } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import countBlogs from "src/services/blogs/countBlogs";
import loadBlogSummaries from "src/services/blogs/loadBlogSummaries";
import queryBlogIds from "src/services/blogs/queryBlogIds";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getBlogs(blogs: Router) {
  blogs.get(
    "/",
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const filters = parseBlogFilter(request.query);

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
