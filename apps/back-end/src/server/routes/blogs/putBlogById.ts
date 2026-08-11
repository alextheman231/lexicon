import type { Router } from "express";

import { UUID_REGEX_PATTERN } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { parseEditBlogData } from "@lexicon/models";

import { getConnection } from "src/database/connection";
import selectBlog from "src/models/blogs/selectBlog";
import changeBlogState from "src/services/blogs/mutations/transaction/changeBlogState";
import editBlog from "src/services/blogs/mutations/transaction/editBlog";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleAuthenticatedEndpointMiddleware from "src/utility/handlers/handleAuthenticatedEndpointMiddleware";
import handleRateLimit from "src/utility/handlers/handleRateLimit";
import msToSeconds from "src/utility/timeConverters/msToSeconds";

function putBlogById(blogs: Router) {
  blogs.put(
    RegExp(`^/(?<blogId>${UUID_REGEX_PATTERN})$`),
    handleRateLimit({
      limit: 5,
      windowMs: msToSeconds(10),
    }),
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
