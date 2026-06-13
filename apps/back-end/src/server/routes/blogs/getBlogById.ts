import type { Router } from "express";

import { az } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { blogQueryStringSchema } from "@lexicon/models";
import z from "zod";

import { getConnection } from "src/database/connection";
import findLatestBlogVersion from "src/services/blogs/findLatestBlogRevision";
import loadBlogView from "src/services/blogs/loadBlogView";
import resourceNotFoundError from "src/utility/errors/resourceNotFoundError";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";
import validateUUID from "src/utility/handlers/validateUUID";

function getBlogById(blogs: Router) {
  blogs.param("blogId", validateUUID).get(
    "/:blogId",
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();

      const { revisionNumber } = az.with(blogQueryStringSchema).parse(request.query, (error) => {
        return new APIError(
          400,
          "INVALID_QUERY_STRING",
          `The provided query string is invalid:\n\n${z.prettifyError(error)}`,
          { query: request.query },
        );
      });
      const { blogId } = request.params;

      const blog = await loadBlogView(connection, { blogId, revisionNumber });

      if (blog === null) {
        throw resourceNotFoundError("blog", blogId);
      }

      const currentVersion = await findLatestBlogVersion(connection, blogId);
      if (currentVersion !== blog.revisionNumber && request.user?.id !== blog.authorId) {
        throw resourceNotFoundError("blog", blogId);
      }

      response.status(200).send({ blog });
    }),
  );
}

export default getBlogById;
