import { Router } from "express";

import { getConnection } from "src/database/connection";
import { selectBlogSummaries, selectBlogView } from "src/services/blogs";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import validateUUID from "src/utility/validators/validateUUID";

const blogsRouter = Router();

blogsRouter.route("/").get(
  handleEndpointMiddleware(async (_request, response) => {
    const connection = getConnection();
    const blogs = await selectBlogSummaries(connection);
    response.status(200).send({ blogs });
  }),
);

blogsRouter
  .param("blogId", validateUUID)
  .route("/:blogId")
  .get(
    handleEndpointMiddleware<{ blogId: string }>(async (request, response) => {
      const connection = getConnection();
      const blog = await selectBlogView(connection, request.params.blogId);

      if (blog === null) {
        throw resourceNotFoundError("blog", request.params.blogId);
      }

      response.status(200).send({ blog });
    }),
  );

export default blogsRouter;
