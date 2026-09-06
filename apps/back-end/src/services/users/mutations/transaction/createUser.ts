import type { CreateUserData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import createUserUnsafe from "src/services/users/mutations/createUser";

async function createUser(
  transaction: Transaction,
  data: Omit<CreateUserData, "dateOfBirth"> & { dateOfBirth?: Date },
): ReturnType<typeof createUserUnsafe> {
  return await createUserUnsafe(transaction, data);
}

export default createUser;
