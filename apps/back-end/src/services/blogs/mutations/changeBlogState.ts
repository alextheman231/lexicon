import type { Blog } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { BlogEndpointIds } from "src/services/blogs/helpers/BlogEndpointIds";

import { assertNotNull } from "@alextheman/utility";
import { DataError } from "@alextheman/utility/v6";
import { BlogState, parseBlog } from "@lexicon/models";

import insertBlogStateHistory from "src/models/blogs/insertBlogStateHistory";
import selectBlog from "src/models/blogs/selectBlog";
import updateBlog from "src/models/blogs/updateBlog";

async function changeBlogState(
  connection: Connection,
  ids: BlogEndpointIds,
  newState: BlogState,
): Promise<Blog | null> {
  const currentBlog = await selectBlog(connection, ids.blogId);
  const today = new Date();

  if (currentBlog === null) {
    return null;
  }

  if (currentBlog.state === newState) {
    return parseBlog(currentBlog);
  }

  const allowedStateTransitions: Record<BlogState, Array<BlogState>> = {
    [BlogState.DRAFT]: [BlogState.PUBLISHED, BlogState.ARCHIVED],
    [BlogState.PUBLISHED]: [BlogState.DRAFT, BlogState.ARCHIVED],
    [BlogState.ARCHIVED]: [BlogState.DRAFT, BlogState.PUBLISHED],
  };

  if (!allowedStateTransitions[currentBlog.state].includes(newState)) {
    throw new DataError(
      { currentState: currentBlog.state, newState },
      "INVALID_STATE_TRANSITION",
      "The provided state transition is not allowed",
    );
  }

  const blog = await updateBlog(connection, ids.blogId, {
    state: newState,
    updatedAt: today,
    publishedAt: newState === BlogState.PUBLISHED ? new Date() : null,
  });
  assertNotNull(blog);
  const { currentRevisionId } = blog;
  assertNotNull(currentRevisionId);

  await insertBlogStateHistory(connection, {
    state: newState,
    updatedById: ids.editorId,
    updatedAt: today,
    blogId: ids.blogId,
    revisionId: currentRevisionId,
  });

  if (blog) {
    assertNotNull(blog.currentRevisionId);
    return { ...blog, currentRevisionId: blog.currentRevisionId };
  }

  return null;
}

export default changeBlogState;
