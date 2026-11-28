import { az } from "@alextheman/utility";
import z from "zod";

import { AuthProvider } from "src/auth/AuthProvider";

const userAuthProviderInsertSchema = z.object({
  id: z.uuid().optional(),
  provider: z.enum(AuthProvider),
  providerUserId: z.string(),
  userId: z.uuid(),
});

export type UserAuthProviderInsertData = z.infer<typeof userAuthProviderInsertSchema>;

export function parseUserAuthProviderInsertData(input: unknown): UserAuthProviderInsertData {
  return az.with(userAuthProviderInsertSchema).parse(input);
}
