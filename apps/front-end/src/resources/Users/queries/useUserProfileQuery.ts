import type { UserProfile } from "@lexicon/models";

import { parseUserProfile } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useUserProfileQuery(userId: string) {
  return useQuery<UserProfile>({
    queryKey: queryKeys.users({ userId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/users/${userId}/profile`);
      return parseUserProfile(data.user);
    },
  });
}

export default useUserProfileQuery;
