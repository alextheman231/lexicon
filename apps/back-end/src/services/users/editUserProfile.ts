import type { User, UserProfileUpdateData } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import updateUser from "src/models/users/updateUser";

async function editUserProfile(
  connection: Connection,
  userId: string,
  data: UserProfileUpdateData,
): Promise<User | null> {
  const user = await updateUser(connection, userId, data);

  if (user !== null) {
    return { ...user, dateOfBirth: az.with(z.coerce.date().nullable()).parse(user.dateOfBirth) };
  }

  return null;
}

export default editUserProfile;
