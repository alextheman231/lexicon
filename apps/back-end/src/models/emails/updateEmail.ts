import type { Connection } from "src/database/connection";
import type { Email, EmailInsert } from "src/database/schema";

import { eq } from "drizzle-orm";

import { emailsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function updateEmail(
  connection: Connection,
  emailId: string,
  data: Partial<EmailInsert>,
): Promise<Email | null> {
  const email = await fetchSole(
    connection.update(emailsTable).set(data).where(eq(emailsTable.id, emailId)).returning(),
  );
  return email;
}

export default updateEmail;
