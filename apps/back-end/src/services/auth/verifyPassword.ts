import type { Connection } from "src/database/connection";

import { verify } from "argon2";

import selectUser from "src/models/users/selectUser";
import InvalidCredentialsError from "src/services/auth/errors/InvalidCredentialsError";

async function verifyPassword(
  connection: Connection,
  userId: string,
  password: string,
): Promise<boolean> {
  const user = await selectUser(connection, { userId });

  if (user === null) {
    throw new InvalidCredentialsError();
  }

  if (user.passwordHash === null) {
    throw new InvalidCredentialsError();
  }

  return await verify(user.passwordHash, password);
}

export default verifyPassword;
