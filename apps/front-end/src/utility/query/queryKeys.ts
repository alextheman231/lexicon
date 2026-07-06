import type { QueryKey } from "@tanstack/react-query";

const queryKeys = {
  auth: (...args: Array<unknown>): QueryKey => {
    return ["auth", ...args];
  },
  backendError: (...args: Array<unknown>): QueryKey => {
    return ["backendError", ...args];
  },
  users: (...args: Array<unknown>): QueryKey => {
    return ["users", ...args];
  },
  blogs: (...args: Array<unknown>): QueryKey => {
    return ["blogs", ...args];
  },
  blogRevisions: (...args: Array<unknown>): QueryKey => {
    return ["blogRevisions", ...args];
  },
  blogCollections: (...args: Array<unknown>): QueryKey => {
    return ["blogCollections", ...args];
  },
  blogCollectionOptions: (...args: Array<unknown>): QueryKey => {
    return ["blogCollectionOptions", ...args];
  },
  metadata: (...args: Array<unknown>): QueryKey => {
    return ["metadata", ...args];
  },
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
