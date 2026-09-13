import { az } from "@alextheman/utility";
import z from "zod";

import { UserState } from "src/users/UserState";

export const userInfoSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  state: z.enum(UserState),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type UserInfo = z.infer<typeof userInfoSchema>;

export function parseUserInfo(input: unknown): UserInfo {
  return az.with(userInfoSchema).parse(input);
}
