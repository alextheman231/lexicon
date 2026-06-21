import type { CreateUserSessionData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import createUserSessionUnsafe from "src/services/userSessions/mutations/createUserSession";

async function createUserSession(
  transaction: Transaction,
  data: CreateUserSessionData,
): ReturnType<typeof createUserSessionUnsafe> {
  return await createUserSessionUnsafe(transaction, data);
}

export default createUserSession;
