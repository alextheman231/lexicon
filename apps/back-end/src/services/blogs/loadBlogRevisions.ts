import type { BlogRevision } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import z from "zod";

import selectBlogRevisions from "src/models/blogs/selectBlogRevisions";

export interface LoadBlogRevisionsFilters {
  blogId: string;
}

async function loadBlogRevisions(
  connection: Connection,
  filters: LoadBlogRevisionsFilters,
): Promise<Array<BlogRevision>> {
  const revisions = await selectBlogRevisions(connection, filters);

  return revisions.map((revision) => {
    return { ...revision, content: az.with(z.record(z.string(), z.any())).parse(revision.content) };
  });
}

export default loadBlogRevisions;
