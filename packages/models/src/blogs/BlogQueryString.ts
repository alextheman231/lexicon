import { az } from "@alextheman/utility";
import z from "zod";

export const blogQueryStringSchema = z.object({
  revisionNumber: z.coerce.number<string>().int().positive().optional(),
});

export type BlogQueryStringInputType = z.input<typeof blogQueryStringSchema>;
export type BlogQueryStringValidatedType = z.output<typeof blogQueryStringSchema>;
export function parseBlogQueryString(input: unknown) {
  return az.with(blogQueryStringSchema).parse(input);
}
