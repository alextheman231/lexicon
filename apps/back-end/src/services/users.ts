import type { CreateUserData, User, UserProfileData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { parseUser } from "@lexicon/models";

import { insertUser, updateUser } from "src/models/users";

export async function createUser(connection: Connection, data: CreateUserData): Promise<User> {
  return parseUser(
    await insertUser(connection, { ...data, dateOfBirth: data.dateOfBirth?.toISOString() }),
  );
}

export async function editUserProfile(
  connection: Connection,
  userId: string,
  data: UserProfileData,
): Promise<User | null> {
  const user = await updateUser(connection, userId, data);
  return user === null ? null : parseUser(user);
}
