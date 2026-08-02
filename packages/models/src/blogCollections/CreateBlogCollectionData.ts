import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";

import { az } from "@alextheman/utility";
import z from "zod";

import { createBlogCollectionItemDataSchema } from "src/blogCollections/CreateBlogCollectionItemData";

export const createBlogCollectionDataSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  items: z.array(createBlogCollectionItemDataSchema).nullable().optional(),
});

export type CreateBlogCollectionData = z.infer<typeof createBlogCollectionDataSchema>;
export function parseCreateBlogCollectionData<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: AzParsingErrorHandler<ErrorType>,
): CreateBlogCollectionData {
  return az.with(createBlogCollectionDataSchema).parse(input, onError);
}
