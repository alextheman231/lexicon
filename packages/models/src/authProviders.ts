import type { CreateEnumType } from "@alextheman/utility";

export const AuthProvider = {
  GOOGLE: "google",
} as const;

export type AuthProvider = CreateEnumType<typeof AuthProvider>;
