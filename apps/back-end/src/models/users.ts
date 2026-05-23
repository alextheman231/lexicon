import type { User, UserInsertData, UserUpdateData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUser } from "@lexicon/models";
import { eq } from "drizzle-orm";

import { usersTable } from "src/database/schema";

export async function insertUser(connection: Connection, data: UserInsertData): Promise<User> {
  const [user] = await connection
    .insert(usersTable)
    .values({ ...data, dateOfBirth: data.dateOfBirth?.toISOString() })
    .returning();
  return parseUser(user);
}

export async function selectUser(connection: Connection, userId: string): Promise<User | null> {
  const [user] = await connection.select().from(usersTable).where(eq(usersTable.id, userId));

  return user ? parseUser(user) : null;
}

export async function updateUser(
  connection: Connection,
  userId: string,
  data: UserUpdateData,
): Promise<User | null> {
  const [user] = await connection
    .update(usersTable)
    .set({ ...data, dateOfBirth: data.dateOfBirth?.toISOString() })
    .where(eq(usersTable.id, userId))
    .returning();

  return parseUser(user);
}
