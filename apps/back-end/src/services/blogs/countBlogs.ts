import type { BlogFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { assertNotNull, az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import buildBlogsQuery from "src/services/blogs/helpers/buildBlogsQuery";
import extractRows from "src/utility/databaseFilters/extractRows";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function countBlogs(
  connection: Connection,
  filters: Omit<BlogFilter, "pageNumber" | "pageSize" | "sortColumn" | "sortDirection">,
): Promise<number> {
  const result = await fetchSole(
    extractRows(connection.execute(buildBlogsQuery(sql`COUNT(*)`, filters))),
  );
  assertNotNull(result);
  return az.with(z.coerce.number().int()).parse(result.count);
}

export default countBlogs;
