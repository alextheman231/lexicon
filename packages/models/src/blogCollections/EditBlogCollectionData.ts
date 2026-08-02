import type { AzParsingErrorHandler } from "@alextheman/utility";
import type { DataError } from "@alextheman/utility/v6";
import type z from "zod";

import { az } from "@alextheman/utility";

import { createBlogCollectionDataSchema } from "src/blogCollections/CreateBlogCollectionData";

export const editBlogCollectionDataSchema = createBlogCollectionDataSchema;

export type EditBlogCollectionData = z.infer<typeof editBlogCollectionDataSchema>;

export function parseEditBlogCollectionData<ErrorType extends Error = DataError>(
  input: unknown,
  onError?: AzParsingErrorHandler<ErrorType>,
): EditBlogCollectionData {
  return az.with(editBlogCollectionDataSchema).parse(input, onError);
}
