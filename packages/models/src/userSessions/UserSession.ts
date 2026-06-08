import { az } from "@alextheman/utility";
import z from "zod";

const userSessionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type UserSession = z.infer<typeof userSessionSchema>;

export function parseUserSession(input: unknown): UserSession {
  return az.with(userSessionSchema).parse(input);
}
