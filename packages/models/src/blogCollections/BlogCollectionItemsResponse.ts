import type { DataError } from "@alextheman/utility/v6";
import type { ZodError } from "zod";

import { az } from "@alextheman/utility";
import z from "zod";

import { blogCollectionItemSummarySchema } from "src/blogCollections/BlogCollectionItemSummary";

export const blogCollectionItemsResponseSchema = z.object({
  items: z.array(blogCollectionItemSummarySchema),
  count: z.int().nonnegative(),
});
export type BlogCollectionItemsResponse = z.infer<typeof blogCollectionItemsResponseSchema>;
export function parseBlogCollectionItemsResponse<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: ErrorType | ((zodError: ZodError) => ErrorType | void),
): BlogCollectionItemsResponse {
  return az.with(blogCollectionItemsResponseSchema).parse(input, onError);
}
