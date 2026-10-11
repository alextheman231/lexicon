import type { UserInfo } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { SelectUserFilter } from "src/models/users/selectUser";

import { and } from "drizzle-orm";

import { usersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import maybeEq from "src/utility/databaseFilters/maybeEq";

async function loadUserInfo(
  connection: Connection,
  filters: SelectUserFilter,
): Promise<UserInfo | null> {
  const user = await fetchSole(
    connection
      .select({
        id: usersTable.id,
        email: usersTable.email,
        state: usersTable.state,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
      })
      .from(usersTable)
      .where(and(maybeEq(usersTable.id, filters.userId), maybeEq(usersTable.email, filters.email))),
  );

  if (user === null) {
    return null;
  }

  return user;
}

export default loadUserInfo;
