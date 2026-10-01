import type { QueryKey } from "@tanstack/react-query";

function createQueryKey(keyName: string): (...args: Array<unknown>) => QueryKey {
  return (...args: Array<unknown>) => {
    return [keyName, ...args];
  };
}

export default createQueryKey;
