import type { Column, SQL, SQLWrapper } from "drizzle-orm";

import { ilike } from "drizzle-orm";

function maybeIlike(
  column: Column | SQL.Aliased,
  right?: string | SQLWrapper,
): ReturnType<typeof ilike> | undefined {
  return right !== undefined ? ilike(column, right) : undefined;
}

export default maybeIlike;
