import { assertNotUndefined } from "@alextheman/utility";
import { parseBlogFilter, parseBlogInsertData } from "@lexicon/models";
import { Router } from "express";

import { getConnection } from "src/database/connection";
import {
  countBlogs,
  insertBlog,
  queryBlogIds,
  selectBlogSummaries,
  selectBlogView,
} from "src/services/blogs";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";
import resourceNotFoundError from "src/utility/resourceNotFoundError";
import requireAuth from "src/utility/validators/requireAuth";
import validateUUID from "src/utility/validators/validateUUID";

const blogsRouter = Router();

blogsRouter
  .route("/")
  .get(
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
  )
  .post(
    requireAuth,
    handleEndpointMiddleware(async (request, response) => {
      const connection = getConnection();
      const data = parseBlogInsertData(request.body);

      assertNotUndefined(request.user);

      const { id } = await insertBlog(connection, { ...data, authorId: request.user.id });
      response.status(201).send({ id });
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
