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
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<unknown>> = {
  auth: [...queryKeys.auth(), ...queryKeys.users()],
  backendError: [...queryKeys.backendError()],
  users: [...queryKeys.users()],
  blogs: [...queryKeys.blogs()],
};

export default queryKeys;
