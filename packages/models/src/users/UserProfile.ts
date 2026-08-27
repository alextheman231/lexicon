import { az } from "@alextheman/utility";
import z from "zod";

export const userProfileSchema = z.object({
  id: z.uuid(),
  username: z.string().max(100),
  description: z.string().nullable(),
  displayName: z.string().max(50).nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  profilePictureUrl: z.string().nullable(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export function parseUserProfile(input: unknown): UserProfile {
  return az.with(userProfileSchema).parse(input);
}
