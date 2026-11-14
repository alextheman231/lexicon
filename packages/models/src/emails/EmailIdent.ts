import type { CreateEnumType } from "@alextheman/utility";

export const EmailIdent = {
  RESET_PASSWORD: "RESET_PASSWORD",
} as const;

export type EmailIdent = CreateEnumType<typeof EmailIdent>;
