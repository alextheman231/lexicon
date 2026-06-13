import type { Connection } from "src/database/connection";
import type { BlogUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function updateBlog(connection: Connection, blogId: string, data: BlogUpdate) {
  const blog = await fetchSole(
    connection.update(blogsTable).set(data).where(eq(blogsTable.id, blogId)).returning(),
  );
  return blog;
}

export default updateBlog;
