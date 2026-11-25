import type { ObjectValue } from "@alextheman/utility";

export const TokenPurpose = {
  COMPLETE_SIGN_UP: "complete-sign-up",
  FORGOTTEN_PASSWORD: "forgotten-password",
} as const;
export type TokenPurpose = ObjectValue<typeof TokenPurpose>;
