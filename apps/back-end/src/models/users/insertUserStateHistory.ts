import type { Connection } from "src/database/connection";
import type { UserStateHistoryInsert, UserStateHistoryRow } from "src/database/schema";

import { assertNotNull } from "@alextheman/utility";

import { userStateHistoryTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertUserStateHistory(
  connection: Connection,
  data: UserStateHistoryInsert,
): Promise<UserStateHistoryRow> {
  const userStateHistory = await fetchSole(
    connection.insert(userStateHistoryTable).values(data).returning(),
  );
  assertNotNull(userStateHistory);
  return userStateHistory;
}

export default insertUserStateHistory;
