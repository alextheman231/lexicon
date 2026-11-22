import type { ObjectValue } from "@alextheman/utility";

export const AuthProvider = {
  END_TO_END: "end-to-end",
  GOOGLE: "google",
} as const;

export type AuthProvider = ObjectValue<typeof AuthProvider>;
