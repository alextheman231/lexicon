const queryKeys = {
  auth: (...args: Array<unknown>) => {
    return ["auth", ...args];
  },
  users: (...args: Array<unknown>) => {
    return ["user", ...args];
  },
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<unknown>> = {
  auth: [...queryKeys.auth(), ...queryKeys.users()],
  users: [...queryKeys.users()],
};

export default queryKeys;
