import { az } from "@alextheman/utility";
import z from "zod";

const createUserSessionSchema = z.object({
  userId: z.uuid(),
  expiresAt: z.coerce.date().optional(),
});

export type CreateUserSessionData = z.infer<typeof createUserSessionSchema>;

export function parseCreateUserSessionData(input: unknown): CreateUserSessionData {
  return az.with(createUserSessionSchema).parse(input);
}
