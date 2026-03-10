import { parseZodSchema } from "@alextheman/utility";
import z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string().max(50),
  displayName: z.string().max(50).nullable(),
  email: z.email(),
  dateOfBirth: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});
export const userInsertSchema = z.object({
  username: z.string().max(50),
  displayName: z.string().max(50).optional(),
  email: z.email(),
  dateOfBirth: z.coerce.date(),
});

export type User = z.infer<typeof userSchema>;
export type UserData = z.infer<typeof userInsertSchema>;

export function parseUser(input: unknown): User {
  return parseZodSchema(userSchema, input);
}

export function parseUsers(input: unknown): Array<User> {
  return parseZodSchema(z.array(userSchema), input);
}

export function parseUserPayload(input: unknown): UserData {
  return parseZodSchema(userInsertSchema, input);
}
