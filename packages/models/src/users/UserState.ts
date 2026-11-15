import type { ObjectValue } from "@alextheman/utility";

export const UserState = {
  VERIFIED: "verified",
  UNVERIFIED: "unverified",
} as const;

export type UserState = ObjectValue<typeof UserState>;
