import type { Router } from "express";

import { parseBlogFilter } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import { countBlogs, queryBlogIds, selectBlogSummaries } from "src/services/blogs";
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

      const blogs = await selectBlogSummaries(connection, blogIds);
      response.status(200).send({ blogs, count });
    }),
  );
}

export default getBlogs;
