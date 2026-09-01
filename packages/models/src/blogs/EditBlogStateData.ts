import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

export const editBlogStateDataSchema = z.object({
  state: z.enum(BlogState),
});

export type EditBlogStateData = z.infer<typeof editBlogStateDataSchema>;

export function parseEditBlogStateData(input: unknown): EditBlogStateData {
  return az.with(editBlogStateDataSchema).parse(input);
}
