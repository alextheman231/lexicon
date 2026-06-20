import type queryKeys from "src/utility/query/queryKeys";

import { useQueryClient } from "@tanstack/react-query";

import { relatedQueryKeys } from "src/utility/query/queryKeys";

function useQueryInvalidation(queryKey: keyof typeof queryKeys) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all(
      relatedQueryKeys[queryKey].map((relatedKey) => {
        return queryClient.invalidateQueries({ queryKey: relatedKey });
      }),
    );
  };
}

export default useQueryInvalidation;
