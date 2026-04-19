import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

const userSessionSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  expiresAt: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export type UserSession = z.infer<typeof userSessionSchema>;
export function parseUserSession(input: unknown): UserSession {
  return parseZodSchema(userSessionSchema, input);
}

const userSessionInsertSchema = z.object({
  userId: z.uuid(),
  expiresAt: z.coerce.date().optional(),
});

export type UserSessionData = z.infer<typeof userSessionInsertSchema>;
export function parseUserSessionData(input: unknown): UserSessionData {
  return parseZodSchema(userSessionInsertSchema, input);
}
