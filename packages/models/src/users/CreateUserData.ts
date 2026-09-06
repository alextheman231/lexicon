import { az } from "@alextheman/utility";
import z from "zod";

const createUserSchema = z.object({
  username: z.string().max(100),
  displayName: z.string().max(50).nullable(),
  description: z.string().nullable(),
  email: z.email(),
  dateOfBirth: z.coerce.date().nullable(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export function parseCreateUserData(input: unknown): CreateUserData {
  return az.with(createUserSchema).parse(input);
}
