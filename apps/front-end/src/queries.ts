import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

export function useBackendErrorQuery() {
  return useQuery({
    queryKey: [queryKeys.backendError()],
    queryFn: async () => {
      await lexiconAuthenticatedClient.get("/api/v1/control/be-error");
    },
  });
}
