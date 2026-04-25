import type { User, UserInsertData, UserProfileData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUser, parseUserInsertData, parseUserProfileData } from "@lexicon/models";
import { eq, sql } from "drizzle-orm";

import { usersTable } from "src/database/schema";

export async function insertUser(connection: Connection, data: UserInsertData): Promise<User> {
  const parsedData = parseUserInsertData(data);
  const [user] = await connection
    .insert(usersTable)
    .values({ ...parsedData, dateOfBirth: parsedData.dateOfBirth?.toISOString() })
    .returning();
  return parseUser(user);
}

export async function selectUser(connection: Connection, userId: string): Promise<User | null> {
  const [user] = await connection
    .select({
      id: usersTable.id,
      username: usersTable.username,
      displayName: usersTable.displayName,
      description: usersTable.description,
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(sql`id = ${userId}`);

  return user ? parseUser(user) : null;
}

export async function updateUserProfile(
  connection: Connection,
  userId: string,
  data: UserProfileData,
): Promise<User> {
  const parsedData = parseUserProfileData(data);
  const [user] = await connection
    .update(usersTable)
    .set(parsedData)
    .where(eq(usersTable.id, userId))
    .returning();

  return parseUser(user);
}
