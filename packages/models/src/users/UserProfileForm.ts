import { az } from "@alextheman/utility";
import z from "zod";

export const userProfileFormSchema = z.object({
  username: az.field(z.string().max(100)),
  displayName: az.field(z.string().max(50).nullable()),
  description: az.field(z.string().nullable()),
});
export type UserProfileFormInputData = z.input<typeof userProfileFormSchema>;
export type UserProfileFormOutputData = z.output<typeof userProfileFormSchema>;
