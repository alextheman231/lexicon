import { az } from "@alextheman/utility";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

const blogSchema = z.object({
  id: z.uuid(),
  authorId: z.uuid(),
  state: z.enum(BlogState),
  currentRevisionId: z.uuid(),
  updatedAt: z.coerce.date(),
  publishedAt: z.coerce.date().nullable(),
});

export type Blog = z.infer<typeof blogSchema>;

export function parseBlog(input: unknown): Blog {
  return az.with(blogSchema).parse(input);
}
export function parseBlogs(input: unknown): Array<Blog> {
  return az.with(z.array(blogSchema)).parse(input);
}
