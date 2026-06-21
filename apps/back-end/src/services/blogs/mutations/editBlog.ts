import type { Blog, EditBlogData } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { BlogEndpointIds } from "src/services/blogs/helpers/BlogEndpointIds";

import { assertNotNull } from "@alextheman/utility";

import insertBlogRevision from "src/models/blogs/insertBlogRevision";
import updateBlog from "src/models/blogs/updateBlog";
import findLatestBlogVersion from "src/services/blogs/views/findLatestBlogRevision";

async function editBlog(
  connection: Connection,
  ids: BlogEndpointIds,
  data: Omit<EditBlogData, "state">,
): Promise<Blog | null> {
  const oldVersionNumber = await findLatestBlogVersion(connection, ids.blogId);

  if (oldVersionNumber === null) {
    return null;
  }

  const { id: newRevisionId } = await insertBlogRevision(connection, {
    title: data.title,
    content: data.content,
    blogId: ids.blogId,
    editorId: ids.editorId,
    version: oldVersionNumber + 1,
  });

  const blog = await updateBlog(connection, ids.blogId, {
    currentRevisionId: newRevisionId,
    updatedAt: new Date(),
  });

  if (blog) {
    assertNotNull(blog.currentRevisionId);
    return { ...blog, currentRevisionId: blog.currentRevisionId };
  }

  return null;
}

export default editBlog;
