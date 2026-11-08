import type { Email } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import updateEmail from "src/models/emails/updateEmail";
import loadEmails from "src/services/emails/loadEmails";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function changeEmailSent(connection: Transaction, emailId: string): Promise<Email | null> {
  const email = await updateEmail(connection, emailId, { sentAt: new Date() });
  return email === null ? null : await fetchSole(loadEmails(connection, { emailId: email.id }));
}

export default changeEmailSent;
