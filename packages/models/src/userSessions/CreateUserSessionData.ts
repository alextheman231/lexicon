import { az } from "@alextheman/utility";
import z from "zod";

const createUserSessionSchema = z.object({
  expiresAt: z.coerce.date().optional(),
  userId: z.uuid(),
});

export type CreateUserSessionData = z.infer<typeof createUserSessionSchema>;

export function parseCreateUserSessionData(input: unknown): CreateUserSessionData {
  return az.with(createUserSessionSchema).parse(input);
}
