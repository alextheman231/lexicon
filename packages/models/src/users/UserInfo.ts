import { az } from "@alextheman/utility";
import z from "zod";

import { UserState } from "src/users/UserState";

export const userInfoSchema = z.object({
  createdAt: z.coerce.date(),
  email: z.email(),
  id: z.uuid(),
  state: z.enum(UserState),
  updatedAt: z.coerce.date().nullable(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

export function parseUserInfo(input: unknown): UserInfo {
  return az.with(userInfoSchema).parse(input);
}
