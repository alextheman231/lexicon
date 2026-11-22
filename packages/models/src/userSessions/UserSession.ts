import { az } from "@alextheman/utility";
import z from "zod";

const userSessionSchema = z.object({
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  id: z.uuid(),
  userId: z.uuid(),
});

export type UserSession = z.infer<typeof userSessionSchema>;

export function parseUserSession(input: unknown): UserSession {
  return az.with(userSessionSchema).parse(input);
}
