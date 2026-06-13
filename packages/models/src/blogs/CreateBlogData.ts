import { az } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import z from "zod";

import { BlogState } from "src/blogs/BlogState";

export const createBlogSchema = z.strictObject({
  title: z.string(),
  content: z.record(z.string(), z.any()),
  state: z.enum(BlogState),
});

export type CreateBlogData = z.infer<typeof createBlogSchema>;

export function parseCreateBlogData(input: unknown): CreateBlogData {
  return az.with(createBlogSchema).parse(
    input,
    new APIError(400, "INVALID_BLOG_DATA", "The provided blog data to create is invalid", {
      input,
    }),
  );
}
