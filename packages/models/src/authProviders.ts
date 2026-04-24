import type { CreateEnumType } from "@alextheman/utility";

import { az } from "@alextheman/utility";
import z from "zod";

export const AuthProvider = {
  GOOGLE: "google",
} as const;

export type AuthProvider = CreateEnumType<typeof AuthProvider>;

const authProviderSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  provider: z.enum(AuthProvider),
  providerUserId: z.string(),
  createdAt: z.coerce.date(),
});

export type AuthProviderSchema = z.infer<typeof authProviderSchema>;

export function parseAuthProviders(input: unknown): Array<AuthProviderSchema> {
  return az.with(z.array(authProviderSchema)).parse(input);
}

export function parseAuthProviderSchema(input: unknown): AuthProviderSchema {
  return az.with(authProviderSchema).parse(input);
}

const authProviderInsertSchema = z.object({
  userId: z.uuid(),
  provider: z.enum(AuthProvider),
  providerUserId: z.string(),
});

export type AuthProviderSchemaData = z.infer<typeof authProviderInsertSchema>;

export function parseAuthProviderSchemaData(input: unknown): AuthProviderSchemaData {
  return az.with(authProviderInsertSchema).parse(input);
}
