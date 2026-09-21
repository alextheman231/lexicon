import { az } from "@alextheman/utility";
import { EmailIdent } from "src/emails/EmailIdent";
import z from "zod";

export const emailSchema = z.object({
    id: z.uuid(),
    context: z.record(z.string(), z.unknown()),
    ident: z.enum(EmailIdent),
    recipientId: z.uuid(),
    sentAt: z.coerce.date().nullable()
})

export type Email = z.infer<typeof emailSchema>

export function parseEmail(input: unknown): Email {
    return az.with(emailSchema).parse(input)
}
