import type { BlogState } from "@lexicon/models";

import type { Transaction } from "src/database/connection";
import type { BlogEndpointIds } from "src/services/blogs/helpers/BlogEndpointIds";

import changeBlogStateUnsafe from "src/services/blogs/mutations/changeBlogState";

async function changeBlogState(
  transaction: Transaction,
  ids: BlogEndpointIds,
  newState: BlogState,
): ReturnType<typeof changeBlogStateUnsafe> {
  return await changeBlogStateUnsafe(transaction, ids, newState);
}

export default changeBlogState;
