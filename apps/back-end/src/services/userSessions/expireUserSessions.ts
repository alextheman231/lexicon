import type { UserSession } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import { and, eq, gte } from "drizzle-orm";

import { userSessionsTable } from "src/database/schema";

interface ExpireUserSessionsData {
  userId: string;
}

async function expireUserSessions(
  connection: Transaction,
  { userId }: ExpireUserSessionsData,
): Promise<Array<UserSession>> {
  const today = new Date();
  const sessions = await connection
    .update(userSessionsTable)
    .set({ expiresAt: today })
    .where(and(eq(userSessionsTable.userId, userId), gte(userSessionsTable.expiresAt, today)))
    .returning();

  return sessions;
}

export default expireUserSessions;
