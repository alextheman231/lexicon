import { az } from "@alextheman/utility";
import z from "zod";

import { UserState } from "src/users/UserState";

const userSchema = z.object({
  createdAt: z.coerce.date(),
  dateOfBirth: z.coerce.date().nullable(),
  description: z.string().nullable().optional(),
  displayName: z.string().max(50).nullable(),
  email: z.email(),
  id: z.uuid(),
  profilePictureFileKey: z.string().nullable(),
  profilePictureFileName: z.string().nullable(),
  state: z.enum(UserState),
  updatedAt: z.coerce.date().nullable(),
  username: z.string().max(100),
});

export type User = z.infer<typeof userSchema>;

export function parseUser(input: unknown): User {
  return az.with(userSchema).parse(input);
}
export function parseUsers(input: unknown): Array<User> {
  return az.with(z.array(userSchema)).parse(input);
}
