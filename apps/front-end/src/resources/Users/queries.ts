import type { User } from "@lexicon/models";

import { parseUser } from "@lexicon/models";
import { useQuery } from "@tanstack/react-query";

import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

export function useCurrentUserQuery() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/auth/current-user");
      return data.user === null ? null : parseUser(data.user);
    },
  });
}
