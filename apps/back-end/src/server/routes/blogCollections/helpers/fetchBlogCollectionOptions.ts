import type { BlogCollectionOption, BlogCollectionsFilter } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { blogCollectionsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";
import maybeEq from "src/utility/databaseFilters/maybeEq";

async function fetchBlogCollectionOptions(
  connection: Connection,
  filters?: BlogCollectionsFilter,
): Promise<Array<BlogCollectionOption>> {
  const options = await fetchAll(
    connection
      .select({ id: blogCollectionsTable.id, name: blogCollectionsTable.name })
      .from(blogCollectionsTable)
      .where(maybeEq(blogCollectionsTable.userId, filters?.userId)),
  );

  return options;
}

export default fetchBlogCollectionOptions;
