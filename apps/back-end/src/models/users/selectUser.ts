import type { Connection } from "src/database/connection";
import type { User } from "src/database/schema";

import { eq } from "drizzle-orm";

import { usersTable } from "src/database/schema";

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
  const query = connection.select().from(usersTable);

  const [user] = filters.userId
    ? await query.where(eq(usersTable.id, filters.userId))
    : filters.email
      ? await query.where(eq(usersTable.email, filters.email))
      : [];
  return user ?? null;
}

export default selectUser;
