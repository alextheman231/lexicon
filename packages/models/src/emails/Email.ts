import { az } from "@alextheman/utility";
import z from "zod";

import { EmailIdent } from "src/emails/EmailIdent";

export const emailSchema = z.object({
  context: z.record(z.string(), z.unknown()),
  id: z.uuid(),
  ident: z.enum(EmailIdent),
  recipientEmail: z.email(),
  recipientId: z.uuid(),
  sentAt: z.coerce.date().nullable(),
});

export type Email = z.infer<typeof emailSchema>;

export function parseEmail(input: unknown): Email {
  return az.with(emailSchema).parse(input);
}
