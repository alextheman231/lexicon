import type { CreateUserData, User } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import { insertUser } from "src/models/users/insertUser";

async function createUser(connection: Connection, data: CreateUserData): Promise<User> {
  const user = await insertUser(connection, {
    ...data,
    dateOfBirth: data.dateOfBirth?.toISOString(),
  });

  return { ...user, dateOfBirth: az.with(z.coerce.date().nullable()).parse(user.dateOfBirth) };
}

export default createUser;
