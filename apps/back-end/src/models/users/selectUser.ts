import type { Connection } from "src/database/connection";
import type { User } from "src/database/schema";

import { and } from "drizzle-orm";

import { usersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import maybeEq from "src/utility/databaseFilters/maybeEq";

interface SelectUserFilterUserId {
  userId: string;
  email?: never;
}

interface SelectUserFilterEmail {
  email?: string;
  userId?: never;
}

export type SelectUserFilter = SelectUserFilterUserId | SelectUserFilterEmail;

async function selectUser(connection: Connection, filters: SelectUserFilter): Promise<User | null> {
  const user = fetchSole(
    connection
      .select()
      .from(usersTable)
      .where(and(maybeEq(usersTable.id, filters.userId), maybeEq(usersTable.email, filters.email))),
  );

  return user ?? null;
}

export default selectUser;
