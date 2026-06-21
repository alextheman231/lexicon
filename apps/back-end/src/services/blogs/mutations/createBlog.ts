import type { Blog, CreateBlogData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { assertNotNull } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";

import insertBlog from "src/models/blogs/insertBlog";
import insertBlogRevision from "src/models/blogs/insertBlogRevision";
import insertBlogStateHistory from "src/models/blogs/insertBlogStateHistory";
import selectBlog from "src/models/blogs/selectBlog";
import updateBlog from "src/models/blogs/updateBlog";

async function createBlog(
  connection: Connection,
  authorId: string,
  data: CreateBlogData,
): Promise<Blog> {
  const today = new Date();

  const isPublished = data.state === BlogState.PUBLISHED;
  const initialBlog = await insertBlog(connection, {
    ...data,
    authorId,
    publishedAt: isPublished ? today : null,
    updatedAt: today,
  });
  const revision = await insertBlogRevision(connection, {
    editorId: authorId,
    blogId: initialBlog.id,
    title: data.title,
    content: data.content,
    version: 1,
  });
  await updateBlog(connection, initialBlog.id, { currentRevisionId: revision.id });
  await insertBlogStateHistory(connection, {
    state: initialBlog.state,
    blogId: initialBlog.id,
    revisionId: revision.id,
    updatedById: initialBlog.authorId,
  });

  const blog = await selectBlog(connection, initialBlog.id);
  assertNotNull(blog);
  assertNotNull(blog.currentRevisionId);

  return { ...blog, currentRevisionId: blog.currentRevisionId };
}

export default createBlog;
