import type { User } from "@lexicon/schema";

import { parseZodSchema } from "@alextheman/utility";
import { usersTable } from "@lexicon/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const userSchema = createSelectSchema(usersTable);

export function parseUser(input: unknown): User {
  return parseZodSchema(userSchema, input);
}

export function parseUsers(input: unknown): Array<User> {
  return parseZodSchema(z.array(userSchema), input);
}

export type { User };
