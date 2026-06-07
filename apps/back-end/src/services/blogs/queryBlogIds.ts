import type { BlogFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { sql } from "drizzle-orm";
import z from "zod";

import { blogsTable } from "src/database/schema";
import buildBlogsQuery from "src/services/blogs/helpers/buildBlogsQuery";

async function queryBlogIds(connection: Connection, filters: BlogFilter): Promise<Array<string>> {
  const { rows } = await connection.execute(buildBlogsQuery(sql`${blogsTable.id}`, filters));
  return az.with(z.array(z.uuid())).parse(
    rows.map((record) => {
      return record.id;
    }),
  );
}

export default queryBlogIds;
