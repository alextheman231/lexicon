import { useQueryClient } from "@tanstack/react-query";

import useMutation from "src/hooks/query/useMutation";
import useLocation from "src/hooks/useLocation";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useLogoutMutation() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      await lexiconAuthenticatedClient.post("/api/v1/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
      setLocation("/");
    },
  });
}

export default useLogoutMutation;
