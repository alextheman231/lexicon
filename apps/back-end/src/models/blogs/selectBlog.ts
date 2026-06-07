import type { Connection } from "src/database/connection";
import type { Blog } from "src/database/schema";

import { eq } from "drizzle-orm";

import { blogsTable } from "src/database/schema";

async function selectBlog(connection: Connection, blogId: string): Promise<Blog | null> {
  const [blog] = await connection.select().from(blogsTable).where(eq(blogsTable.id, blogId));
  return blog ?? null;
}

export default selectBlog;
