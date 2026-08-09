import type { BlogsFilter } from "@lexicon/models";
import type { SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { and, eq } from "drizzle-orm";

import { blogRevisionsTable, blogsTable } from "src/database/schema";
import { BlogSortColumn } from "src/services/blogs/helpers/BlogSortColumn";
import maybeEq from "src/utility/databaseFilters/maybeEq";
import sortOptions from "src/utility/databaseFilters/sortOptions";
import paginate from "src/utility/miscellaneous/paginate";

function buildBlogsQuery(
  connection: Connection,
  select: { id: PgColumn } | { count: SQL },
  filters: BlogsFilter,
) {
  const sortColumn = filters.sortColumn ? BlogSortColumn[filters.sortColumn] : undefined;
  const query = (() => {
    const query = connection
      .select(select)
      .from(blogsTable)
      .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
      .where(
        and(
          maybeEq(blogsTable.authorId, filters.authorId),
          maybeEq(blogsTable.state, filters.state),
        ),
      );

    if (sortColumn && filters.sortDirection) {
      query.orderBy(sortOptions(sortColumn, filters.sortDirection));
    }
    return query;
  })();

  if (filters.pageNumber && filters.pageSize) {
    return paginate(query, {
      pageSize: filters.pageSize,
      pageNumber: filters.pageNumber,
    });
  }
  return query;
}

export default buildBlogsQuery;
