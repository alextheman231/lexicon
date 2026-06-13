import type { Connection } from "src/database/connection";
import type { User } from "src/database/schema";

import { and, eq } from "drizzle-orm";

import { usersTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface SelectUserFilterUserId {
  userId: string;
  email?: never;
}

interface SelectUserFilterEmail {
  email?: string;
  userId?: never;
}

type SelectUserFilter = SelectUserFilterUserId | SelectUserFilterEmail;

async function selectUser(connection: Connection, filters: SelectUserFilter): Promise<User | null> {
  const user = fetchSole(
    connection
      .select()
      .from(usersTable)
      .where(
        and(
          filters.userId !== undefined ? eq(usersTable.id, filters.userId) : undefined,
          filters.email !== undefined ? eq(usersTable.email, filters.email) : undefined,
        ),
      ),
  );

  return user ?? null;
}

export default selectUser;
