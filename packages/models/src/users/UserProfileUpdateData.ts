import type z from "zod";

import { az } from "@alextheman/utility";

import { userProfileInsertSchema } from "src/users/UserProfileInsertData";

const userProfileUpdateSchema = userProfileInsertSchema;

export type UserProfileUpdateData = z.infer<typeof userProfileInsertSchema>;

export function parseUserProfileUpdateData(input: unknown): UserProfileUpdateData {
  return az.with(userProfileUpdateSchema).parse(input);
}
