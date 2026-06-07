import type { Router } from "express";

import { assertNotUndefined } from "@alextheman/utility";
import { parseCreateBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import { createBlog } from "src/services/blogs";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import requireAuth from "src/utility/validators/requireAuth";

function postBlogs(blogs: Router) {
  blogs.post(
    "/",
    requireAuth,
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const data = parseCreateBlogData(request.body);
        assertNotUndefined(request.user);

        const { id } = await createBlog(transaction, request.user.id, data);
        response.status(201).send({ id });
      });
    }),
  );
}

export default postBlogs;
