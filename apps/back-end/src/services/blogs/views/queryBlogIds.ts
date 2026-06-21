import type { BlogFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import { blogsTable } from "src/database/schema";
import buildBlogsQuery from "src/services/blogs/helpers/buildBlogsQuery";
import fetchValues from "src/utility/databaseFilters/fetchValues";

async function queryBlogIds(connection: Connection, filters: BlogFilter): Promise<Array<string>> {
  const ids = await fetchValues(buildBlogsQuery(connection, { id: blogsTable.id }, filters));
  return az.with(z.array(z.uuid())).parse(ids);
}

export default queryBlogIds;
