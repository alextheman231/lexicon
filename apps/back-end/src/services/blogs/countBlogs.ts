import type { BlogFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { assertNotNull, az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import buildBlogsQuery from "src/services/blogs/helpers/buildBlogsQuery";
import extractRows from "src/utility/databaseFilters/extractRows";
import fetchValue from "src/utility/databaseFilters/fetchValue";

async function countBlogs(
  connection: Connection,
  filters: Omit<BlogFilter, "pageNumber" | "pageSize" | "sortColumn" | "sortDirection">,
): Promise<number> {
  const count = await fetchValue(
    extractRows(connection.execute(buildBlogsQuery(sql`COUNT(*)`, filters))),
  );
  assertNotNull(count);
  return az.with(z.coerce.number().int()).parse(count);
}

export default countBlogs;
