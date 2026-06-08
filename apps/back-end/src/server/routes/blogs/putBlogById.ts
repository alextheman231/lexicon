import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import changeBlogState from "src/services/blogs/changeBlogState";
import editBlog from "src/services/blogs/editBlog";
import loadBlogView from "src/services/blogs/loadBlogView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function putBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).put(
    "/:blogId",
    handleAuthenticatedEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const oldBlog = await loadBlogView(transaction, request.params.blogId);
        if (oldBlog === null) {
          throw resourceNotFoundError("blog", request.params.blogId);
        }

        if (oldBlog.authorId !== request.user.id) {
          throw new APIError(
            403,
            "FORBIDDEN_ACCESS",
            "You do not have permission to edit this blog.",
          );
        }

        const data = parseEditBlogData(request.body);

        const ids = { blogId: request.params.blogId, editorId: request.user.id };

        await editBlog(transaction, ids, data);
        await changeBlogState(transaction, ids, data.state);

        response.status(200).send({});
      });
    }),
  );
}

export default putBlogById;
