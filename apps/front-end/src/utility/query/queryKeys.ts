import type { QueryKey } from "@tanstack/react-query";

import createQueryKey from "src/utility/query/createQueryKey";

const queryKeys = {
  auth: createQueryKey("auth"),
  backendError: createQueryKey("backendError"),
  blogCollectionOptions: createQueryKey("blogCollectionOptions"),
  blogCollections: createQueryKey("blogCollections"),
  blogRevisions: createQueryKey("blogRevisions"),
  blogs: createQueryKey("blog"),
  metadata: createQueryKey("metadata"),
  users: createQueryKey("users"),
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<QueryKey>> = {
  auth: [queryKeys.auth(), queryKeys.users()],
  backendError: [queryKeys.backendError()],
  blogCollectionOptions: [queryKeys.blogCollectionOptions()],
  blogCollections: [queryKeys.blogCollections()],
  blogRevisions: [
    queryKeys.blogs(),
    queryKeys.blogRevisions(),
    queryKeys.blogCollections(),
    queryKeys.blogCollectionOptions(),
  ],
  blogs: [
    queryKeys.blogs(),
    queryKeys.blogRevisions(),
    queryKeys.blogCollections(),
    queryKeys.blogCollectionOptions(),
  ],
  metadata: [queryKeys.metadata()],
  users: [queryKeys.users()],
};

export default queryKeys;
