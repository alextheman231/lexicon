import type { CreateBlogData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import createBlogUnsafe from "src/services/blogs/mutations/createBlog";

async function createBlog(
  transaction: Transaction,
  authorId: string,
  data: CreateBlogData,
): ReturnType<typeof createBlogUnsafe> {
  return await createBlogUnsafe(transaction, authorId, data);
}

export default createBlog;
