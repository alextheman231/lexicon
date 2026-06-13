import type { BlogCollectionItemsFilter } from "@lexicon/models";
import type { SQL } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { eq } from "drizzle-orm";

import { blogCollectionItemsTable } from "src/database/schema";
import BlogCollectionItemSortColumn from "src/services/blogCollections/helpers/BlogCollectionItemSortColumn";
import sortOptions from "src/utility/databaseFilters/sortOptions";
import paginate from "src/utility/miscellaneous/paginate";

function buildBlogCollectionItemsQuery(
  connection: Connection,
  blogCollectionId: string,
  select: { id: PgColumn } | { count: SQL },
  filters: BlogCollectionItemsFilter,
) {
  const sortColumn = filters.sortColumn
    ? BlogCollectionItemSortColumn[filters.sortColumn]
    : undefined;

  const query = (() => {
    const query = connection
      .select(select)
      .from(blogCollectionItemsTable)
      .where(eq(blogCollectionItemsTable.blogCollectionId, blogCollectionId));

    if (sortColumn && filters.sortDirection) {
      return query.orderBy(sortOptions(sortColumn, filters.sortDirection));
    }
    return query;
  })();

  if (filters.pageNumber && filters.pageSize) {
    return paginate(query, { pageNumber: filters.pageNumber, pageSize: filters.pageSize });
  }
  return query;
}

export default buildBlogCollectionItemsQuery;
