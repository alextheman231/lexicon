import { az } from "@alextheman/utility";
import z from "zod";

import { UserState } from "src/users/UserState";

export const userProfileSchema = z.object({
  createdAt: z.coerce.date(),
  description: z.string().nullable(),
  displayName: z.string().max(50).nullable(),
  id: z.uuid(),
  profilePictureUrl: z.string().nullable(),
  state: z.enum(UserState),
  updatedAt: z.coerce.date().nullable(),
  username: z.string().max(100),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export function parseUserProfile(input: unknown): UserProfile {
  return az.with(userProfileSchema).parse(input);
}
