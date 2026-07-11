import { az } from "@alextheman/utility";
import z from "zod";

export const blogCollectionOptionsQueryStringSchema = z.object({
  selectedBlogId: z.uuid().optional(),
});

export type BlogCollectionOptionsQueryString = z.infer<
  typeof blogCollectionOptionsQueryStringSchema
>;

export function parseBlogCollectionOptionsQueryString(
  input: unknown,
): BlogCollectionOptionsQueryString {
  return az.with(blogCollectionOptionsQueryStringSchema).parse(input);
}
