import type { Transaction } from "src/database/connection";

import removeBlogCollectionItemUnsafe from "src/services/blogCollections/mutations/removeBlogCollectionItem";

async function removeBlogCollectionItem(
  transaction: Transaction,
  blogCollectionId: string,
  blogCollectionItemId: string,
): ReturnType<typeof removeBlogCollectionItemUnsafe> {
  return await removeBlogCollectionItemUnsafe(transaction, blogCollectionId, blogCollectionItemId);
}

export default removeBlogCollectionItem;
