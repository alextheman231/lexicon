import type { Transaction } from "src/database/connection";
import type { BlogCollectionEndpointIds } from "src/services/blogCollections/helpers/BlogCollectionEndpointIds";
import type { EditBlogCollectionData } from "src/services/blogCollections/helpers/EditBlogCollectionData";

import editBlogCollectionUnsafe from "src/services/blogCollections/mutations/editBlogCollection";

async function editBlogCollection(
  transaction: Transaction,
  ids: BlogCollectionEndpointIds,
  data: EditBlogCollectionData,
): ReturnType<typeof editBlogCollectionUnsafe> {
  return await editBlogCollectionUnsafe(transaction, ids, data);
}

export default editBlogCollection;
