// eslint-disable-next-line no-restricted-imports -- We need to import useQuery here so that the rest of the app doesn't need to.
import { useQuery as useTanstackQuery } from "@tanstack/react-query";

import retry from "src/hooks/query/helpers/retry";
import throwOnError from "src/hooks/query/helpers/throwOnError";

function useQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
>(
  ...[options, queryClient]: Parameters<
    typeof useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>
  >
): ReturnType<typeof useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>> {
  return useTanstackQuery<TQueryFnData, TError, TData, TQueryKey>(
    {
      throwOnError,
      retry: retry(options.queryKey),
      ...options,
    },
    queryClient,
  );
}

export default useQuery;
