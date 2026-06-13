import type z from "zod";

import { az } from "@alextheman/utility";

import { createBlogCollectionDataSchema } from "src/services/blogCollections/helpers/CreateBlogCollectionData";

export const editBlogCollectionDataSchema = createBlogCollectionDataSchema;

export type EditBlogCollectionData = z.infer<typeof editBlogCollectionDataSchema>;

export function parseEditBlogCollectionData(input: unknown): EditBlogCollectionData {
  return az.with(editBlogCollectionDataSchema).parse(input);
}
