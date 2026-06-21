import type { Transaction } from "src/database/connection";
import type { CreateBlogCollectionItemData } from "src/services/blogCollections/helpers/CreateBlogCollectionItemData";

import createBlogCollectionItemsUnsafe from "src/services/blogCollections/mutations/createBlogCollectionItems";

async function createBlogCollectionItems(
  transaction: Transaction,
  blogCollectionId: string,
  data: Array<CreateBlogCollectionItemData>,
): ReturnType<typeof createBlogCollectionItemsUnsafe> {
  return await createBlogCollectionItemsUnsafe(transaction, blogCollectionId, data);
}

export default createBlogCollectionItems;
