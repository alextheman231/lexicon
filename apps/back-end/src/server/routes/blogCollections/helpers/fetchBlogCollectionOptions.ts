import type { BlogCollectionOption } from "@lexicon/models";

import type { Connection } from "src/database/connection";

import { az } from "@alextheman/utility";
import { and, eq, exists, sql } from "drizzle-orm";
import z from "zod";

import { blogCollectionItemsTable, blogCollectionsTable } from "src/database/schema";
import fetchAll from "src/utility/databaseFilters/fetchAll";
import maybeEq from "src/utility/databaseFilters/maybeEq";

interface FetchBlogCollectionOptionsArgs {
  userId?: string;
  selectedBlogId?: string;
}

async function fetchBlogCollectionOptions(
  connection: Connection,
  args?: FetchBlogCollectionOptionsArgs,
): Promise<Array<BlogCollectionOption>> {
  const options = await fetchAll(
    connection
      .select({
        id: blogCollectionsTable.id,
        name: blogCollectionsTable.name,
        selected: args?.selectedBlogId
          ? exists(
              connection
                .select()
                .from(blogCollectionItemsTable)
                .where(
                  and(
                    eq(blogCollectionItemsTable.blogCollectionId, blogCollectionsTable.id),
                    eq(blogCollectionItemsTable.blogId, args.selectedBlogId),
                  ),
                ),
            )
          : sql`FALSE`.as("selected"),
      })
      .from(blogCollectionsTable)
      .where(maybeEq(blogCollectionsTable.userId, args?.userId)),
  );

  return options.map((option) => {
    return { ...option, selected: az.with(z.coerce.boolean()).parse(option.selected) };
  });
}

export default fetchBlogCollectionOptions;
