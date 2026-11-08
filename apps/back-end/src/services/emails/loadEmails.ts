import type { Email, EmailIdent } from "@lexicon/models";
import type { LockConfig } from "drizzle-orm/pg-core";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { emailsTable, usersTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";
import maybeEq from "src/utility/databaseFilters/maybeEq";

interface FetchEmailsFilters {
  emailId?: string;
  ident?: EmailIdent;
  sentAt?: Date | null;
  forUpdate?: LockConfig;
}

async function loadEmails(
  connection: Connection,
  { emailId, ident, sentAt, forUpdate }: FetchEmailsFilters,
): Promise<Array<Email>> {
  const emails = await fetchAll(
    connection
      .select({
        id: emailsTable.id,
        context: emailsTable.context,
        ident: emailsTable.ident,
        recipientId: emailsTable.recipientId,
        recipientEmail: usersTable.email,
        sentAt: emailsTable.sentAt,
      })
      .from(emailsTable)
      .innerJoin(usersTable, eq(emailsTable.recipientId, usersTable.id))
      .where(
        and(
          maybeEq(emailsTable.id, emailId),
          maybeEq(emailsTable.ident, ident),
          maybeEq(emailsTable.sentAt, sentAt),
        ),
      )
      .for("update", forUpdate),
  );

  return emails.map((email) => {
    return { ...email, context: az.with(z.record(z.string(), z.unknown())).parse(email.context) };
  });
}

export default loadEmails;
