import type { SortDirection } from "@alextheman/utility";
import type { PgColumn } from "drizzle-orm/pg-core";

import { asc, desc } from "drizzle-orm";

function sortOptions<SortColumn extends PgColumn>(
  sortColumn: SortColumn,
  sortDirection: SortDirection,
) {
  switch (sortDirection) {
    case "asc": {
      return asc(sortColumn);
    }
    case "desc": {
      return desc(sortColumn);
    }
    default: {
      throw sortDirection satisfies never;
    }
  }
}

export default sortOptions;
