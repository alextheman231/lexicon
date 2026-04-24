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

const userSessionInsertSchema = z.object({
  userId: z.uuid(),
  expiresAt: z.coerce.date().optional(),
});

export type UserSessionData = z.infer<typeof userSessionInsertSchema>;
export function parseUserSessionData(input: unknown): UserSessionData {
  return az.with(userSessionInsertSchema).parse(input);
}
