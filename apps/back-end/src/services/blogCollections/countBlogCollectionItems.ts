import type { Connection } from "src/database/connection";

import { assertNotUndefined, az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import buildBlogCollectionItemsQuery from "src/services/blogCollections/helpers/buildBlogCollectionItemsQuery";
import fetchValue from "src/utility/databaseFilters/fetchValue";

async function countBlogCollectionItems(
  connection: Connection,
  blogCollectionId: string,
): Promise<number> {
  const count = await fetchValue(
    buildBlogCollectionItemsQuery(connection, blogCollectionId, { count: sql`COUNT(*)` }, {}),
  );
  assertNotUndefined(count);
  return az.with(z.coerce.number().int().nonnegative()).parse(count);
}

export default countBlogCollectionItems;
