import type { CreateBlogCollectionData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import createBlogCollectionUnsafe from "src/services/blogCollections/mutations/createBlogCollection";

async function createBlogCollection(
  transaction: Transaction,
  userId: string,
  data: CreateBlogCollectionData,
): ReturnType<typeof createBlogCollectionUnsafe> {
  return await createBlogCollectionUnsafe(transaction, userId, data);
}

export default createBlogCollection;
