import type { LockConfig } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { desc, eq } from "drizzle-orm";

import { blogRevisionsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface FindLatestBlogVersionOptions {
  forUpdate?: LockConfig;
}

async function findLatestBlogVersion(
  connection: Connection,
  blogId: string,
  options?: FindLatestBlogVersionOptions,
): Promise<number | null> {
  const query = (() => {
    const query = connection
      .select({ version: blogRevisionsTable.version })
      .from(blogRevisionsTable)
      .where(eq(blogRevisionsTable.blogId, blogId))
      .orderBy(desc(blogRevisionsTable.version))
      .limit(1);

    if (options?.forUpdate) {
      return query.for("update", options.forUpdate);
    }

    return query;
  })();

  const revision = await fetchSole(query);

  return revision === null ? null : revision.version;
}

export default findLatestBlogVersion;
