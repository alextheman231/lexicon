import type { CreateEnumType } from "@alextheman/utility";

export const AuthProvider = {
  GOOGLE: "google",
  END_TO_END: "end-to-end",
} as const;

export type AuthProvider = CreateEnumType<typeof AuthProvider>;
