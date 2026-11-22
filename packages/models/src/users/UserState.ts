import type { ObjectValue } from "@alextheman/utility";

export const UserState = {
  UNVERIFIED: "unverified",
  VERIFIED: "verified",
} as const;

export type UserState = ObjectValue<typeof UserState>;
