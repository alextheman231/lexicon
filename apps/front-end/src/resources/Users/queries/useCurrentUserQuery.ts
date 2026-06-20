import type { User } from "@lexicon/models";

import { parseUser } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useCurrentUserQuery() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/current-user");
      return data.user === null ? null : parseUser(data.user);
    },
  });
}

export default useCurrentUserQuery;
