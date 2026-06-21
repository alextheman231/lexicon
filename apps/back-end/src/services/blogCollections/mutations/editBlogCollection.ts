import type { BlogCollection } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { BlogCollectionEndpointIds } from "src/services/blogCollections/helpers/BlogCollectionEndpointIds";
import type { EditBlogCollectionData } from "src/services/blogCollections/helpers/EditBlogCollectionData";

import { omitProperties } from "@alextheman/utility";

import updateBlogCollection from "src/models/blogCollections/updateBlogCollection";
import createBlogCollectionItems from "src/services/blogCollections/mutations/createBlogCollectionItems";

async function editBlogCollection(
  connection: Connection,
  ids: BlogCollectionEndpointIds,
  data: EditBlogCollectionData,
): Promise<BlogCollection | null> {
  const blogCollection = await updateBlogCollection(connection, ids.blogCollectionId, {
    ...omitProperties(data, "items"),
    userId: ids.userId,
  });

  if (blogCollection === null) {
    return null;
  }

  if (data.items) {
    await createBlogCollectionItems(connection, blogCollection.id, data.items);
  }

  return blogCollection;
}

export default editBlogCollection;
