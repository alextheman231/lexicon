import { useQueryClient } from "@tanstack/react-query";

import useMutation from "src/hooks/query/useMutation";
import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import useLocation from "src/hooks/useLocation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useLogoutMutation() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  const invalidate = useQueryInvalidation("auth");

  return useMutation({
    mutationFn: async () => {
      await lexiconAuthenticatedClient.post("/api/v1/auth/logout");
    },
    onSuccess: async () => {
      queryClient.setQueryData(queryKeys.auth(), null);
      await invalidate();
      setLocation("/");
    },
  });
}

export default useLogoutMutation;
