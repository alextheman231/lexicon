import type { Connection } from "src/database/connection";

import { eq } from "drizzle-orm";

import { blogsTable } from "src/database/schema";

async function deleteBlog(connection: Connection, blogId: string) {
  await connection.delete(blogsTable).where(eq(blogsTable.id, blogId));
}

export default deleteBlog;
