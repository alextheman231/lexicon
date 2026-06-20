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
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<QueryKey>> = {
  auth: [queryKeys.auth(), queryKeys.users()],
  backendError: [queryKeys.backendError()],
  users: [queryKeys.users()],
  blogs: [queryKeys.blogs(), queryKeys.blogRevisions()],
  blogRevisions: [queryKeys.blogs(), queryKeys.blogRevisions()],
};

export default queryKeys;
