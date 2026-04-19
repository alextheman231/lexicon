const queryKeys = {
  auth: (...args: Array<unknown>) => {
    return ["auth", ...args];
  },
};

export const relatedQueryKeys: Record<keyof typeof queryKeys, Array<unknown>> = {
  auth: [...queryKeys.auth()],
};

export default queryKeys;
