import { az } from "@alextheman/utility";
import z from "zod";

export const putBlogToBlogCollectionsSchema = z.object({
  blogCollectionIds: z.array(z.uuid()),
});

export type PutBlogToBlogCollectionsData = z.infer<typeof putBlogToBlogCollectionsSchema>;

export function parsePutBlogToBlogCollectionsData(input: unknown): PutBlogToBlogCollectionsData {
  return az.with(putBlogToBlogCollectionsSchema).parse(input);
}
