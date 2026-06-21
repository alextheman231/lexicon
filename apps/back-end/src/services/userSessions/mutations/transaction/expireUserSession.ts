import type { Transaction } from "src/database/connection";

import expireUserSessionUnsafe from "src/services/userSessions/mutations/expireUserSession";

async function expireUserSession(
  transaction: Transaction,
  sessionId: string,
): ReturnType<typeof expireUserSessionUnsafe> {
  return await expireUserSessionUnsafe(transaction, sessionId);
}

export default expireUserSession;
