import type { Transaction } from "src/database/connection";

import setBlogCollectionsForBlogBase from "src/services/blogCollections/mutations/setBlogCollectionsForBlog";

async function setBlogCollectionsForBlog(
  connection: Transaction,
  blogId: string,
  desiredCollectionIds: Array<string>,
): Promise<void> {
  return await setBlogCollectionsForBlogBase(connection, blogId, desiredCollectionIds);
}

export default setBlogCollectionsForBlog;
