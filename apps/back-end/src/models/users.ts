import type { Connection } from "src/database/connection";
import type { User, UserInsert, UserUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { parseUser, usersTable } from "src/database/schema";

export async function insertUser(connection: Connection, data: UserInsert): Promise<User> {
  const [user] = await connection.insert(usersTable).values(data).returning();
  return parseUser(user);
}

interface SelectUserFilterUserId {
  userId: string;
  email?: never;
}

interface SelectUserFilterEmail {
  email?: string;
  userId?: never;
}

type SelectUserFilter = SelectUserFilterUserId | SelectUserFilterEmail;

export async function selectUser(
  connection: Connection,
  filters: SelectUserFilter,
): Promise<User | null> {
  const query = connection.select().from(usersTable);

  const [user] = filters.userId
    ? await query.where(eq(usersTable.id, filters.userId))
    : filters.email
      ? await query.where(eq(usersTable.email, filters.email))
      : [];
  return user ? parseUser(user) : null;
}

export async function updateUser(
  connection: Connection,
  userId: string,
  data: UserUpdate,
): Promise<User | null> {
  const [user] = await connection
    .update(usersTable)
    .set(data)
    .where(eq(usersTable.id, userId))
    .returning();

  return user ? parseUser(user) : null;
}
