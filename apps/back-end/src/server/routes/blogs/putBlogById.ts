import type { Router } from "express";

import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import changeBlogState from "src/services/blogs/mutations/transaction/changeBlogState";
import editBlog from "src/services/blogs/mutations/transaction/editBlog";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function putBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).put(
    "/:blogId",
    handleAuthenticatedEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const { blogId } = request.params;
        const oldBlog = await selectBlog(transaction, blogId);
        if (oldBlog === null) {
          throw resourceNotFoundError("blog", blogId);
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
