import type { BlogFilter } from "@lexicon/models";
import type { SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { and, asc, desc, eq } from "drizzle-orm";

import { blogRevisionsTable, blogsTable } from "src/database/schema";
import { BlogSortColumn } from "src/services/blogs/helpers/BlogSortColumn";
import paginate from "src/utility/miscellaneous/paginate";

function buildBlogsQuery(
  connection: Connection,
  select: { id: PgColumn } | { count: SQL },
  filters: BlogFilter,
) {
  const sortColumn = filters.sortColumn ? BlogSortColumn[filters.sortColumn] : undefined;

  const query = (() => {
    const query = connection
      .select(select)
      .from(blogsTable)
      .innerJoin(blogRevisionsTable, eq(blogRevisionsTable.id, blogsTable.currentRevisionId))
      .where(
        and(
          filters.authorId ? eq(blogsTable.authorId, filters.authorId) : undefined,
          filters.state ? eq(blogsTable.state, filters.state) : undefined,
        ),
      );

    if (sortColumn && filters.sortDirection) {
      query.orderBy(filters.sortDirection === "desc" ? desc(sortColumn) : asc(sortColumn));
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
