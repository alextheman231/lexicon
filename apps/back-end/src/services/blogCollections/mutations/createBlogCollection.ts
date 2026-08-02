import type { BlogCollection, CreateBlogCollectionData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { omitProperties } from "@alextheman/utility";

import insertBlogCollection from "src/models/blogCollections/insertBlogCollection";
import createBlogCollectionItems from "src/services/blogCollections/mutations/createBlogCollectionItems";

async function createBlogCollection(
  connection: Connection,
  userId: string,
  data: CreateBlogCollectionData,
): Promise<BlogCollection> {
  const blogCollection = await insertBlogCollection(connection, {
    userId,
    ...omitProperties(data, "items"),
  });

  if (data.items) {
    await createBlogCollectionItems(connection, blogCollection.id, data.items);
  }

  return blogCollection;
}

export default createBlogCollection;
