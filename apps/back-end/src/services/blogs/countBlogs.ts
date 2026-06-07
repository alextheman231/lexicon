import type { BlogFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import buildBlogsQuery from "src/services/blogs/helpers/buildBlogsQuery";

async function countBlogs(
  connection: Connection,
  filters: Omit<BlogFilter, "pageNumber" | "pageSize" | "sortColumn" | "sortDirection">,
): Promise<number> {
  const {
    rows: [{ count }],
  } = await connection.execute(buildBlogsQuery(sql`COUNT(*)`, filters));
  return az.with(z.coerce.number().int()).parse(count);
}

export default countBlogs;
