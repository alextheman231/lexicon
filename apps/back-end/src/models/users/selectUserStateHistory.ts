import type { Connection } from "src/database/connection";
import type { UserStateHistoryRow } from "src/database/schema";

import { eq } from "drizzle-orm";

import { userStateHistoryTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";

async function selectUserStateHistory(
  connection: Connection,
  userId: string,
): Promise<Array<UserStateHistoryRow>> {
  return await fetchAll(
    connection.select().from(userStateHistoryTable).where(eq(userStateHistoryTable.userId, userId)),
  );
}

export default selectUserStateHistory;
