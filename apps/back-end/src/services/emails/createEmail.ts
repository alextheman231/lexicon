import type { Email, EmailIdent } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import { assertNotNull } from "@alextheman/utility";

import insertEmail from "src/models/emails/insertEmail";
import loadEmails from "src/services/emails/loadEmails";
import fetchSole from "src/utility/databaseFilters/fetchSole";

interface CreateEmailData {
  context: Record<string, unknown>;
  ident: EmailIdent;
  recipientId: string;
  sentAt: Date | null;
}

async function createEmail(connection: Transaction, data: CreateEmailData): Promise<Email> {
  const email = await insertEmail(connection, data);
  const result = await fetchSole(loadEmails(connection, { emailId: email.id }));
  assertNotNull(result);
  return result;
}

export default createEmail;
