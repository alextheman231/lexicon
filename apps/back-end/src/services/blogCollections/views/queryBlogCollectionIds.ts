import type { BlogCollectionsFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionsTable } from "src/database/schema";
import buildBlogCollectionsQuery from "src/services/blogCollections/helpers/buildBlogCollectionsQuery";
import fetchValues from "src/utility/databaseFilters/fetchValues";

async function queryBlogCollectionIds(
  connection: Connection,
  filters: BlogCollectionsFilter,
): Promise<Array<string>> {
  const ids = await fetchValues(
    buildBlogCollectionsQuery(connection, { id: blogCollectionsTable.id }, filters),
  );
  return az.with(z.array(z.uuid())).parse(ids);
}

export default queryBlogCollectionIds;
