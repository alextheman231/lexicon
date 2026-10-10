import type { CreateUserData, User, UserState } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import { insertUser } from "src/models/users/insertUser";
import insertUserStateHistory from "src/models/users/insertUserStateHistory";

async function createUser(
  connection: Connection,
  data: Omit<CreateUserData, "dateOfBirth"> & { dateOfBirth?: Date; state: UserState },
): Promise<User> {
  const user = await insertUser(connection, {
    ...data,
    dateOfBirth: data.dateOfBirth?.toISOString(),
  });

  await insertUserStateHistory(connection, {
    userId: user.id,
    state: user.state,
    updatedById: null,
  });

  return { ...user, dateOfBirth: az.with(z.coerce.date().nullable()).parse(user.dateOfBirth) };
}

export default createUser;
