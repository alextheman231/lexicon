import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import z from "zod";

export const createBlogSchema = z.strictObject({
  title: z.string(),
  content: z.record(z.string(), z.any()),
  state: z.enum(BlogState),
});

export type CreateBlogData = z.infer<typeof createBlogSchema>;

export function parseCreateBlogData<ErrorType extends Error = DataError>(
  input: unknown,
  error?: AzParsingErrorHandler<ErrorType>,
): CreateBlogData {
  return az.with(createBlogSchema).parse(input, error);
}
