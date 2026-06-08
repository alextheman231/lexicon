import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";
import { createBlogSchema } from "src/blogs/CreateBlogData";

export const blogUpdateSchema = createBlogSchema
  .omit({
    state: true,
  })
  .extend({
    state: z.enum(BlogState),
  });

export type EditBlogData = z.infer<typeof blogUpdateSchema>;

export function parseEditBlogData(input: unknown): EditBlogData {
  return az.with(blogUpdateSchema).parse(input);
}
