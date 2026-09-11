import type { BlogCollection, EditBlogCollectionData } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { BlogCollectionEndpointIds } from "src/services/blogCollections/helpers/BlogCollectionEndpointIds";

import updateBlogCollection from "src/models/blogCollections/updateBlogCollection";

async function editBlogCollection(
  connection: Connection,
  ids: BlogCollectionEndpointIds,
  data: EditBlogCollectionData,
): Promise<BlogCollection | null> {
  const blogCollection = await updateBlogCollection(connection, ids.blogCollectionId, {
    ...data,
    userId: ids.userId,
  });

  if (blogCollection === null) {
    return null;
  }

  return blogCollection;
}

export default editBlogCollection;
