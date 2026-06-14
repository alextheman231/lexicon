import type { Placeholder } from "drizzle-orm";

interface PaginationSettings {
  pageSize: number;
  pageNumber?: number;
}

function paginate<QueryReturn>(
  query: {
    limit: (limit: number | Placeholder) => {
      offset: (offset: number | Placeholder) => QueryReturn;
    };
  },
  { pageSize, pageNumber = 1 }: PaginationSettings,
) {
  return query.limit(pageSize).offset((pageNumber - 1) * pageSize);
}

export default paginate;
