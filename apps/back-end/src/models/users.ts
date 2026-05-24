import type { Connection } from "src/database/connection";
import type { User, UserInsert, UserUpdate } from "src/database/schema";

import { eq } from "drizzle-orm";

import { parseUser, usersTable } from "src/database/schema";

export async function insertUser(connection: Connection, data: UserInsert): Promise<User> {
  const [user] = await connection.insert(usersTable).values(data).returning();
  return parseUser(user);
}

export async function selectUser(connection: Connection, userId: string): Promise<User | null> {
  const [user] = await connection.select().from(usersTable).where(eq(usersTable.id, userId));
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
