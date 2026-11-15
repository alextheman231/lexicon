import type { User } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import updateUser from "src/models/users/updateUser";
import hashPassword from "src/services/auth/hashPassword";
import scorePassword from "src/services/auth/scorePassword";

async function changeUserPassword(
  connection: Transaction,
  userId: string,
  password: string,
): Promise<User | null> {
  scorePassword(password);
  const passwordHash = await hashPassword(password);

  const user = await updateUser(connection, userId, { passwordHash });

  if (user !== null) {
    return { ...user, dateOfBirth: az.with(z.coerce.date().nullable()).parse(user.dateOfBirth) };
  }

  return null;
}

export default changeUserPassword;
