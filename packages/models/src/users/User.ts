import { az } from "@alextheman/utility";
import z from "zod";

const userSchema = z.object({
  id: z.uuid(),
  username: z.string().max(100),
  description: z.string().nullable().optional(),
  displayName: z.string().max(50).nullable(),
  email: z.email(),
  dateOfBirth: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  profilePictureFileKey: z.string().nullable(),
  profilePictureFileName: z.string().nullable(),
});

export type User = z.infer<typeof userSchema>;

export function parseUser(input: unknown): User {
  return az.with(userSchema).parse(input);
}
export function parseUsers(input: unknown): Array<User> {
  return az.with(z.array(userSchema)).parse(input);
}
