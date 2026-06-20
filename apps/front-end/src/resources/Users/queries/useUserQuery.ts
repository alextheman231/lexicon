import type { User } from "@lexicon/models";

import { parseUser } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useUserQuery(userId: string) {
  return useQuery<User>({
    queryKey: queryKeys.users(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/users/${userId}`);
      return parseUser(data.user);
    },
  });
}

export default useUserQuery;
