import { az } from "@alextheman/utility";
import z from "zod";

import { UserState } from "src/users/UserState";

export const userStateHistorySchema = z.object({
  id: z.int().positive(),
  updatedById: z.uuid().nullable(),
  userId: z.uuid(),
  state: z.enum(UserState),
  updatedAt: z.coerce.date(),
});
export type UserStateHistoryRow = z.infer<typeof userStateHistorySchema>;

export function parseUserStateHistoryRow(input: unknown): UserStateHistoryRow {
  return az.with(userStateHistorySchema).parse(input);
}
export function parseUserStateHistory(input: unknown): Array<UserStateHistoryRow> {
  return az.with(z.array(userStateHistorySchema)).parse(input);
}
