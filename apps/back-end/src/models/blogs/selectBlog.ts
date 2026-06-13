import type { Connection } from "src/database/connection";
import type { Blog } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function selectBlog(connection: Connection, blogId: string): Promise<Blog | null> {
  const blog = await fetchSole(
    connection.select().from(blogsTable).where(eq(blogsTable.id, blogId)),
  );
  return blog;
}

export default selectBlog;
