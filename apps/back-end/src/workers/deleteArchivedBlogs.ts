import { addDaysToDate } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import { and, desc, eq, lte } from "drizzle-orm";
import nodeCron from "node-cron";

import { getConnection } from "src/database/connection";
import { blogsTable, blogStateHistoryTable } from "src/database/schema";
import deleteBlog from "src/models/blogs/deleteBlog";
import fetchValues from "src/utility/databaseFilters/fetchValues";

const deleteArchivedBlogs = nodeCron.createTask("1 0 * * *", async () => {
  const connection = getConnection();

  const mostRecentArchivedCte = connection.$with("most_recent_archived_cte").as(
    connection
      .selectDistinctOn([blogStateHistoryTable.blogId], {
        blogId: blogStateHistoryTable.blogId,
        archivedAt: blogStateHistoryTable.updatedAt,
      })
      .from(blogStateHistoryTable)
      .where(eq(blogStateHistoryTable.state, BlogState.ARCHIVED))
      .orderBy(
        blogStateHistoryTable.blogId,
        desc(blogStateHistoryTable.updatedAt),
        desc(blogStateHistoryTable.id),
      ),
  );

  const blogIdsToDelete = await fetchValues(
    connection
      .with(mostRecentArchivedCte)
      .select({ id: blogsTable.id })
      .from(blogsTable)
      .innerJoin(mostRecentArchivedCte, eq(mostRecentArchivedCte.blogId, blogsTable.id))
      .where(
        and(
          eq(blogsTable.state, BlogState.ARCHIVED),
          lte(mostRecentArchivedCte.archivedAt, addDaysToDate(new Date(), -30)),
        ),
      ),
  );

  if (blogIdsToDelete.length === 0) {
    console.info("No archived blogs to delete");
    return;
  }

  const s = blogIdsToDelete.length === 1 ? "" : "s";

  console.info(`Found ${blogIdsToDelete.length} archived blog${s} to delete`);

  for (const blogId of blogIdsToDelete) {
    await deleteBlog(connection, blogId);
  }

  console.info(`Deleted ${blogIdsToDelete.length} blog${s} successfully`);
});

export default deleteArchivedBlogs;
