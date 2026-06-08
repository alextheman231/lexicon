import { az } from "@alextheman/utility";
import z from "zod";

const createUserSchema = z.object({
  id: z.uuid().optional(), // Needed for factory
  username: z.string().max(100),
  displayName: z.string().max(50).optional(),
  description: z.string().optional(),
  email: z.email(),
  dateOfBirth: z.coerce.date().optional(),
});

export type CreateUserData = z.infer<typeof createUserSchema>;

export function parseCreateUserData(input: unknown): CreateUserData {
  return az.with(createUserSchema).parse(input);
}
