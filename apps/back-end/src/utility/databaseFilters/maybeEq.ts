import type { SQLWrapper } from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";

import { eq } from "drizzle-orm";

function maybeEq<Column extends PgColumn, Value>(left: Column, right?: Value | SQLWrapper) {
  return right !== undefined ? eq(left, right) : undefined;
}

export default maybeEq;
