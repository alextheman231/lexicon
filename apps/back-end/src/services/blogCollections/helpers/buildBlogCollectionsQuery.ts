import type { BlogCollectionsFilter } from "@lexicon/models";
import type { SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { and, eq } from "drizzle-orm";

import { blogCollectionItemsTable, blogCollectionsTable } from "src/database/schema";
import BlogCollectionsSortColumn from "src/services/blogCollections/helpers/BlogCollectionsSortColumn";
import maybeEq from "src/utility/databaseFilters/maybeEq";
import sortOptions from "src/utility/databaseFilters/sortOptions";
import paginate from "src/utility/miscellaneous/paginate";

function buildBlogCollectionsQuery(
  connection: Connection,
  select: { id: PgColumn } | { count: SQL },
  filters: BlogCollectionsFilter,
) {
  const sortColumn = filters.sortColumn ? BlogCollectionsSortColumn[filters.sortColumn] : undefined;
  const query = (() => {
    const query = (() => {
      const query = connection.select(select).from(blogCollectionsTable);

      if (filters.blogId) {
        return query.innerJoin(
          blogCollectionItemsTable,
          eq(blogCollectionItemsTable.blogCollectionId, blogCollectionsTable.id),
        );
      }
      return query;
    })().where(
      and(
        maybeEq(blogCollectionsTable.userId, filters.userId),
        maybeEq(blogCollectionItemsTable.blogId, filters.blogId),
      ),
    );

    if (sortColumn && filters.sortDirection) {
      return query.orderBy(sortOptions(sortColumn, filters.sortDirection));
    }
    return query;
  })();

  if (filters.pageNumber && filters.pageSize) {
    return paginate(query, { pageSize: filters.pageSize, pageNumber: filters.pageNumber });
  }
  return query;
}

export default buildBlogCollectionsQuery;
