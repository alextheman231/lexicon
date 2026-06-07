import { az } from "@alextheman/utility";
import z from "zod";

import { AuthProvider } from "src/authProviders/AuthProvider";

const userAuthProviderInsertSchema = z.object({
  id: z.uuid().optional(),
  userId: z.uuid(),
  provider: z.enum(AuthProvider),
  providerUserId: z.string(),
});

export type UserAuthProviderInsertData = z.infer<typeof userAuthProviderInsertSchema>;

export function parseUserAuthProviderInsertData(input: unknown): UserAuthProviderInsertData {
  return az.with(userAuthProviderInsertSchema).parse(input);
}
