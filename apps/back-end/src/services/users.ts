import type { User, UserData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUser, parseUserPayload } from "@lexicon/models";
import { sql } from "drizzle-orm";

import { usersTable } from "src/database/schema";

export async function insertUser(connection: Connection, data: UserData): Promise<User> {
  const parsedData = parseUserPayload(data);
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
      email: usersTable.email,
      dateOfBirth: usersTable.dateOfBirth,
      createdAt: usersTable.createdAt,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .where(sql`id = ${userId}`);

  return user ? parseUser(user) : null;
}
