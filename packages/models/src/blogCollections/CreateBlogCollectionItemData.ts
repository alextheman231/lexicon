import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

export const createBlogCollectionItemDataSchema = z.object({
  blogId: z.uuid(),
});

export type CreateBlogCollectionItemData = z.infer<typeof createBlogCollectionItemDataSchema>;
export function parseCreateBlogCollectionItemData<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: AzParsingErrorHandler<ErrorType>,
): CreateBlogCollectionItemData {
  return az.with(createBlogCollectionItemDataSchema).parse(input, onError);
}
