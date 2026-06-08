import { az } from "@alextheman/utility";
import z from "zod";

export const userProfileInsertSchema = z.object({
  username: z.string().max(100),
  displayName: z.string().max(50).optional(),
  description: z.string().optional(),
});

export type UserProfileInsertData = z.infer<typeof userProfileInsertSchema>;

export function parseUserProfileInsertData(input: unknown): UserProfileInsertData {
  return az.with(userProfileInsertSchema).parse(input);
}
