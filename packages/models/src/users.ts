import { az } from "@alextheman/utility";
import z from "zod";

export const userSchema = z.object({
  id: z.uuid(),
  username: z.string().max(100),
  description: z.string().optional(),
  displayName: z.string().max(50).nullable(),
  email: z.email(),
  dateOfBirth: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});
export const userProfileInsertSchema = z.object({
  username: z.string().max(100),
  displayName: z.string().max(50).optional(),
  description: z.string().optional(),
  dateOfBirth: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;
export type UserProfileData = z.infer<typeof userProfileInsertSchema>;

export const userProfileFormSchema = z.object({
  username: az.field(z.string().max(100)),
  displayName: az.field(z.string().max(50).nullable()),
  description: az.field(z.string().nullable()),
});
export type UserProfileFormInputData = z.input<typeof userProfileFormSchema>;
export type UserProfileFormOutputData = z.output<typeof userProfileFormSchema>;

export function parseUser(input: unknown): User {
  return az.with(userSchema).parse(input);
}

export function parseUsers(input: unknown): Array<User> {
  return az.with(z.array(userSchema)).parse(input);
}

export function parseUserPayload(input: unknown): UserProfileData {
  return az.with(userProfileInsertSchema).parse(input);
}
