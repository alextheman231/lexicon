import type { User as DrizzleUser } from "@lexicon/schema";

import { parseZodSchema } from "@alextheman/utility";
import { usersTable } from "@lexicon/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const userSchema = createSelectSchema(usersTable);
export type User = z.infer<typeof userSchema>;

export function parseUser(input: unknown): User {
  return parseZodSchema(userSchema, input) satisfies DrizzleUser;
}

export function parseUsers(input: unknown): Array<User> {
  return parseZodSchema(z.array(userSchema), input) satisfies Array<DrizzleUser>;
}
