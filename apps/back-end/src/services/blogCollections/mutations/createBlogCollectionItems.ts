import type { BlogCollectionItem, CreateBlogCollectionItemData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { blogCollectionItemsTable } from "src/database/schema";
import findLatestBlogCollectionItemNumber from "src/services/blogCollections/views/findLatestBlogCollectionItemNumber";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function createBlogCollectionItems(
  connection: Connection,
  blogCollectionId: string,
  data: Array<CreateBlogCollectionItemData>,
): Promise<Array<BlogCollectionItem>> {
  const initialItemNumber =
    (await findLatestBlogCollectionItemNumber(connection, blogCollectionId)) ?? 0;

  const blogCollections = await fetchAll(
    connection
      .insert(blogCollectionItemsTable)
      .values(
        data.map((item, index) => {
          return { ...item, blogCollectionId, itemNumber: initialItemNumber + index + 1 };
        }),
      )
      .returning(),
  );

  return blogCollections;
}

export default createBlogCollectionItems;
