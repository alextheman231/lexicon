import type { Transaction } from "src/database/connection";
import type { ItemFilter } from "src/services/blogCollections/mutations/removeBlogCollectionItem";

import removeBlogCollectionItemUnsafe from "src/services/blogCollections/mutations/removeBlogCollectionItem";

async function removeBlogCollectionItem(
  transaction: Transaction,
  blogCollectionId: string,
  itemFilter: ItemFilter,
): ReturnType<typeof removeBlogCollectionItemUnsafe> {
  return await removeBlogCollectionItemUnsafe(transaction, blogCollectionId, itemFilter);
}

export default removeBlogCollectionItem;
