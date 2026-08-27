import type { UserProfile } from "@lexicon/models";

import { parseUserProfile } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useUserQuery(userId: string) {
  return useQuery<UserProfile>({
    queryKey: queryKeys.users(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/users/${userId}`);
      return parseUserProfile(data.user);
    },
  });
}

export default useUserQuery;
