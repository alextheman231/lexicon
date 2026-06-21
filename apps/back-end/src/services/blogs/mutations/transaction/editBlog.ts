import type { EditBlogData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";
import type { BlogEndpointIds } from "src/services/blogs/helpers/BlogEndpointIds";

import editBlogUnsafe from "src/services/blogs/mutations/editBlog";

async function editBlog(
  transaction: Transaction,
  ids: BlogEndpointIds,
  data: Omit<EditBlogData, "state">,
): ReturnType<typeof editBlogUnsafe> {
  return await editBlogUnsafe(transaction, ids, data);
}

export default editBlog;
