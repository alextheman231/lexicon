import { az } from "@alextheman/utility";
import { Email, EmailIdent } from "@lexicon/models";
import { Transaction } from "src/database/connection";
import insertEmail from "src/models/emails/insertEmail";
import z from "zod";

interface CreateEmailData {
    context: Record<string, unknown>
    ident: EmailIdent
    recipientId: string
    sentAt: Date | null
}

async function createEmail(connection: Transaction, data: CreateEmailData): Promise<Email> {
    const email =  await insertEmail(connection, data)
    return {...email, context: az.with(z.record(z.string(), z.unknown())).parse(email.context)}
}

export default createEmail
