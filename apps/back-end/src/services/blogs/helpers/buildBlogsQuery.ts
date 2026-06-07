import type { BlogFilter } from "@lexicon/models";
import type { SQL } from "drizzle-orm";

import { sql } from "drizzle-orm";

import { blogRevisionsTable, blogsTable } from "src/database/schema";
import { BlogSortColumn } from "src/services/blogs/helpers/BlogSortColumn";
import paginate from "src/utility/miscellaneous/paginate";

function buildBlogsQuery(select: SQL, filters: BlogFilter): SQL {
  const conditions: Array<SQL> = [];

  if (filters.authorId) {
    conditions.push(sql`${blogsTable.authorId} = ${filters.authorId} `);
  }

  if (filters.state) {
    conditions.push(sql`${blogsTable.state} = ${filters.state} `);
  }

  const where = conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

  const query = sql`
    SELECT ${select}
    FROM ${blogsTable}
    JOIN ${blogRevisionsTable} ON ${blogRevisionsTable.id} = ${blogsTable.currentRevisionId}
    ${where}
  `;

  if (filters.sortColumn && filters.sortDirection) {
    const sortColumn = BlogSortColumn[filters.sortColumn];
    query.append(sql`
      ORDER BY ${sortColumn} ${sql.raw(filters.sortDirection)}
    `);
  }

  if (filters.pageNumber && filters.pageSize) {
    query.append(paginate(filters.pageSize, filters.pageNumber));
  }

  return query;
}

export default buildBlogsQuery;
