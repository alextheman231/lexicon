import { az } from "@alextheman/utility";
import z from "zod";

const createUserSchema = z.object({
  dateOfBirth: z.coerce.date(),
  description: z.string().nullable(),
  displayName: z.string().max(50).nullable(),
  email: z.email(),
  username: z.string().max(100),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export function parseCreateUserData(input: unknown): CreateUserData {
  return az.with(createUserSchema).parse(input);
}
