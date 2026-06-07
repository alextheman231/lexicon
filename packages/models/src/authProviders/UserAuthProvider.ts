import { az } from "@alextheman/utility";
import z from "zod";

import { AuthProvider } from "src/authProviders/AuthProvider";

const userAuthProviderSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  provider: z.enum(AuthProvider),
  providerUserId: z.string(),
  createdAt: z.coerce.date(),
});

export type UserAuthProvider = z.infer<typeof userAuthProviderSchema>;

export function parseUserAuthProviders(input: unknown): Array<UserAuthProvider> {
  return az.with(z.array(userAuthProviderSchema)).parse(input);
}

export function parseUserAuthProvider(input: unknown): UserAuthProvider {
  return az.with(userAuthProviderSchema).parse(input);
}
