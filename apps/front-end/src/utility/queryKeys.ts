const queryKeys = {
  auth: (...args: Array<unknown>) => {
    return ["auth", ...args];
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
  users: [...queryKeys.users()],
  blogs: [...queryKeys.blogs()],
};

export default queryKeys;
