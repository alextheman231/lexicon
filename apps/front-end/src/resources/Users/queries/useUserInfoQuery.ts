import type { UserInfo } from "@lexicon/models";

import { parseUserInfo } from "@lexicon/models";

import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/query/queryKeys";

function useUserInfoQuery(userId: string) {
  return useQuery<UserInfo>({
    queryKey: queryKeys.users({ userId }),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/users/${userId}/info`);
      return parseUserInfo(data.user);
    },
  });
}

export default useUserInfoQuery;
