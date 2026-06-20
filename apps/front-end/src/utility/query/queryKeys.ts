const queryKeys = {
  auth: (...args: Array<unknown>) => {
    return ["auth", ...args];
  },
  backendError: (...args: Array<unknown>) => {
    return ["backendError", ...args];
  },
  users: (...args: Array<unknown>) => {
    return ["users", ...args];
  },
  blogs: (...args: Array<unknown>) => {
    return ["blogs", ...args];
  },
  blogRevisions: (...args: Array<unknown>) => {
    return ["blogRevisions", ...args];
  },
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<unknown>> = {
  auth: [...queryKeys.auth(), ...queryKeys.users()],
  backendError: [...queryKeys.backendError()],
  users: [...queryKeys.users()],
  blogs: [...queryKeys.blogs(), queryKeys.blogRevisions()],
  blogRevisions: [...queryKeys.blogs(), queryKeys.blogRevisions()],
};

export default queryKeys;
