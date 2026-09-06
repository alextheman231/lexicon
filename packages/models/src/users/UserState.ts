import type { CreateEnumType } from "@alextheman/utility";

export const UserState = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
} as const;

export type UserState = CreateEnumType<typeof UserState>;
