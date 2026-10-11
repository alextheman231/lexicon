import { az } from "@alextheman/utility";
import { Email, EmailIdent } from "@lexicon/models";
import { and } from "drizzle-orm";
import { LockConfig } from "drizzle-orm/pg-core";
import { Connection } from "src/database/connection";
import { emailsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";
import maybeEq from "src/utility/databaseFilters/maybeEq";
import z from "zod";

interface FetchEmailsFilters {
    ident?: EmailIdent
    sentAt?: Date | null
    forUpdate?: LockConfig;
}

async function loadEmails(connection: Connection, {ident, sentAt, forUpdate}: FetchEmailsFilters): Promise<Array<Email>> {
    const emails = await fetchAll(connection.select({
        id: emailsTable.id,
        context: emailsTable.context,
        ident: emailsTable.ident,
        recipientId: emailsTable.recipientId,
        sentAt: emailsTable.sentAt
    }).from(emailsTable).where(and(
        maybeEq(emailsTable.ident, ident),
        maybeEq(emailsTable.sentAt, sentAt)
    )).for("update", forUpdate))

    return emails.map((email) => {
        return {...email, context: az.with(z.record(z.string(), z.unknown())).parse(email.context)}
    })
}

export default loadEmails
