import type { BlogCollectionItemsFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionItemsTable } from "src/database/schema";
import buildBlogCollectionItemsQuery from "src/services/blogCollections/helpers/buildBlogCollectionItemsQuery";
import fetchValues from "src/utility/databaseFilters/fetchValues";

async function queryBlogCollectionItemIds(
  connection: Connection,
  blogCollectionId: string,
  filters: BlogCollectionItemsFilter,
) {
  const ids = await fetchValues(
    buildBlogCollectionItemsQuery(
      connection,
      blogCollectionId,
      { id: blogCollectionItemsTable.id },
      filters,
    ),
  );
  return az.with(z.array(z.uuid())).parse(ids);
}

export default queryBlogCollectionItemIds;
