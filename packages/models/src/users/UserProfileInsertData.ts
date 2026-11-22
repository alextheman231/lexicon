import { az } from "@alextheman/utility";
import z from "zod";

export const userProfileInsertSchema = z.object({
  description: z.string().optional().nullable(),
  displayName: z.string().max(50).optional(),
  username: z.string().max(100),
});

export type UserProfileInsertData = z.infer<typeof userProfileInsertSchema>;

export function parseUserProfileInsertData(input: unknown): UserProfileInsertData {
  return az.with(userProfileInsertSchema).parse(input);
}
