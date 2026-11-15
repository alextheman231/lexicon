import type { Blog } from "@lexicon/models";

import type { Transaction } from "src/database/connection";
import type { BlogEndpointIds } from "src/services/blogs/helpers/BlogEndpointIds";

import { assertNotNull } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";

import insertBlogStateHistory from "src/models/blogs/insertBlogStateHistory";
import selectBlog from "src/models/blogs/selectBlog";
import updateBlog from "src/models/blogs/updateBlog";
import InvalidStateTransitionError from "src/utility/errors/InvalidStateTransition";

async function changeBlogState(
  connection: Transaction,
  ids: BlogEndpointIds,
  newState: BlogState,
): Promise<Blog | null> {
  const currentBlog = await selectBlog(connection, ids.blogId);
  const today = new Date();

  if (currentBlog === null) {
    return null;
  }

  if (currentBlog.state === newState) {
    assertNotNull(currentBlog.currentRevisionId);
    return { ...currentBlog, currentRevisionId: currentBlog.currentRevisionId };
  }

  const allowedStateTransitions: Record<BlogState, Array<BlogState>> = {
    [BlogState.DRAFT]: [BlogState.PUBLISHED, BlogState.ARCHIVED],
    [BlogState.PUBLISHED]: [BlogState.DRAFT, BlogState.ARCHIVED],
    [BlogState.ARCHIVED]: [BlogState.DRAFT, BlogState.PUBLISHED],
  };

  if (!allowedStateTransitions[currentBlog.state].includes(newState)) {
    throw new InvalidStateTransitionError({ currentState: currentBlog.state, newState });
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
