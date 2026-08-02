import type { CreateBlogCollectionItemData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import createBlogCollectionItemsUnsafe from "src/services/blogCollections/mutations/createBlogCollectionItems";

async function createBlogCollectionItems(
  transaction: Transaction,
  blogCollectionId: string,
  data: Array<CreateBlogCollectionItemData>,
): ReturnType<typeof createBlogCollectionItemsUnsafe> {
  return await createBlogCollectionItemsUnsafe(transaction, blogCollectionId, data);
}

export default createBlogCollectionItems;
