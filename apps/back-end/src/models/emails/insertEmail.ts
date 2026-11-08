import type { Connection } from "src/database/connection";
import type { Email, EmailInsert } from "src/database/schema";

import { assertNotNull } from "@alextheman/utility";

import { emailsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertEmail(connection: Connection, data: EmailInsert): Promise<Email> {
  const email = await fetchSole(connection.insert(emailsTable).values(data).returning());
  assertNotNull(email);
  return email;
}

export default insertEmail;
