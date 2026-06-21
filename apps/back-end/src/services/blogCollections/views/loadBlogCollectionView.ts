import type { BlogCollectionView } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import selectBlogCollection from "src/models/blogCollections/selectBlogCollection";
import countBlogCollectionItems from "src/services/blogCollections/views/countBlogCollectionItems";

async function loadBlogCollectionView(
  connection: Connection,
  blogCollectionId: string,
): Promise<BlogCollectionView | null> {
  const blogCollection = await selectBlogCollection(connection, blogCollectionId);
  if (blogCollection === null) {
    return null;
  }
  const itemCount = await countBlogCollectionItems(connection, blogCollectionId);

  return { ...blogCollection, itemCount };
}

export default loadBlogCollectionView;
