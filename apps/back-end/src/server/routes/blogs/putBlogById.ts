import type { Router } from "express";

import { assertNotUndefined } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import { changeBlogState, editBlog, selectBlogView } from "src/services/blogs";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import requireAuth from "src/utility/validators/requireAuth";
import validateUUID from "src/utility/validators/validateUUID";

function putBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).put(
    "/:blogId",
    requireAuth,
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      await connection.transaction(async (transaction) => {
        const oldBlog = await selectBlogView(transaction, request.params.blogId);
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
