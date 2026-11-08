import { az } from "@alextheman/utility";
import z from "zod";

import { EmailIdent } from "src/emails/EmailIdent";

export const emailSchema = z.object({
  id: z.uuid(),
  context: z.record(z.string(), z.unknown()),
  ident: z.enum(EmailIdent),
  recipientId: z.uuid(),
  sentAt: z.coerce.date().nullable(),
  recipientEmail: z.email(),
});

export type Email = z.infer<typeof emailSchema>;

export function parseEmail(input: unknown): Email {
  return az.with(emailSchema).parse(input);
}
