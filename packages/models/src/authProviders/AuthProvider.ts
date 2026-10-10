import type { ObjectValue } from "@alextheman/utility";

export const AuthProvider = {
  GOOGLE: "google",
  END_TO_END: "end-to-end",
} as const;

export type AuthProvider = ObjectValue<typeof AuthProvider>;
