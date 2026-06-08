import type { Router } from "express";

import { parseCreateBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import createBlog from "src/services/blogs/createBlog";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";

function postBlogs(blogs: Router) {
  blogs.post(
    "/",
    handleAuthenticatedEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const data = parseCreateBlogData(request.body);

        const { id } = await createBlog(transaction, request.user.id, data);
        response.status(201).send({ id });
      });
    }),
  );
}

export default postBlogs;
