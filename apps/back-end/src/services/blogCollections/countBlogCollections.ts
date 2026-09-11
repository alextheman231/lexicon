import type { BlogCollectionsFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import buildBlogCollectionsQuery from "src/services/blogCollections/helpers/buildBlogCollectionsQuery";
import fetchValue from "src/utility/databaseFilters/fetchValue";

async function countBlogCollections(
  connection: Connection,
  filters: Pick<BlogCollectionsFilter, "userId">,
): Promise<number> {
  const count = await fetchValue(
    buildBlogCollectionsQuery(connection, { count: sql`COUNT(*)` }, filters),
  );
  return az.with(z.coerce.number().int().nonnegative()).parse(count);
}

export default countBlogCollections;
