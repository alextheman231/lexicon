import type { QueryKey } from "@tanstack/react-query";

import createQueryKey from "src/utility/query/createQueryKey";

const queryKeys = {
  auth: createQueryKey("auth"),
  backendError: createQueryKey("backendError"),
  users: createQueryKey("users"),
  blogs: createQueryKey("blog"),
  blogRevisions: createQueryKey("blogRevisions"),
  blogCollections: createQueryKey("blogCollections"),
  blogCollectionOptions: createQueryKey("blogCollectionOptions"),
  metadata: createQueryKey("metadata"),
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<QueryKey>> = {
  auth: [queryKeys.auth(), queryKeys.users()],
  backendError: [queryKeys.backendError()],
  users: [queryKeys.users()],
  blogs: [
    queryKeys.blogs(),
    queryKeys.blogRevisions(),
    queryKeys.blogCollections(),
    queryKeys.blogCollectionOptions(),
  ],
  blogRevisions: [
    queryKeys.blogs(),
    queryKeys.blogRevisions(),
    queryKeys.blogCollections(),
    queryKeys.blogCollectionOptions(),
  ],
  blogCollections: [queryKeys.blogCollections()],
  blogCollectionOptions: [queryKeys.blogCollectionOptions()],
  metadata: [queryKeys.metadata()],
};

export default queryKeys;
