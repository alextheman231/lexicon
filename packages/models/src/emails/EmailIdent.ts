import type { ObjectValue } from "@alextheman/utility";

export const EmailIdent = {
  COMPLETE_SIGN_UP: "COMPLETE_SIGN_UP",
} as const;

export type EmailIdent = ObjectValue<typeof EmailIdent>;
