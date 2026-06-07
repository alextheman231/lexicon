import type { Router } from "express";

import { assertNotUndefined } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import changeBlogState from "src/services/blogs/changeBlogState";
import editBlog from "src/services/blogs/editBlog";
import loadBlogView from "src/services/blogs/loadBlogView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import requireAuth from "src/utility/handlers/requireAuth";
import validateUUID from "src/utility/handlers/validateUUID";

function putBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).put(
    "/:blogId",
    requireAuth,
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const oldBlog = await loadBlogView(transaction, request.params.blogId);
        if (oldBlog === null) {
          throw resourceNotFoundError("blog", request.params.blogId);
        }

        assertNotUndefined(request.user);

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
