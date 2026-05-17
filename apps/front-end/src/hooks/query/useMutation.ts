// eslint-disable-next-line no-restricted-imports -- We need to import useMutation here so that the rest of the app doesn't need to.
import { useMutation as useTanstackMutation } from "@tanstack/react-query";

import retry from "src/hooks/query/helpers/retry";
import throwOnError from "src/hooks/query/helpers/throwOnError";

function useMutation<TData = unknown, TError = Error, TVariables = void, TOnMutateResult = unknown>(
  ...[options, queryClient]: Parameters<
    typeof useTanstackMutation<TData, TError, TVariables, TOnMutateResult>
  >
): ReturnType<typeof useTanstackMutation<TData, TError, TVariables, TOnMutateResult>> {
  return useTanstackMutation<TData, TError, TVariables, TOnMutateResult>(
    {
      retry: retry(),
      throwOnError,
      ...options,
    },
    queryClient,
  );
}

export default useMutation;
