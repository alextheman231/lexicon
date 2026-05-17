import type { User, UserProfileFormOutputData } from "@lexicon/models";

import { parseUser } from "@lexicon/models";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";

import useMutation from "src/hooks/query/useMutation";
import useQuery from "src/hooks/query/useQuery";
import lexiconAuthenticatedClient from "src/utility/lexiconAuthenticatedClient";
import queryKeys from "src/utility/queryKeys";

export function useCurrentUserQuery() {
  return useQuery<User | null>({
    queryKey: queryKeys.auth(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get("/api/v1/current-user");
      return data.user === null ? null : parseUser(data.user);
    },
  });
}

export function useLogoutMutation() {
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

export function useUserQuery(userId: string) {
  return useQuery<User>({
    queryKey: queryKeys.users(),
    queryFn: async () => {
      const { data } = await lexiconAuthenticatedClient.get(`/api/v1/users/${userId}`);
      return parseUser(data.user);
    },
  });
}

export function useUpdateUserProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UserProfileFormOutputData) => {
      await lexiconAuthenticatedClient.put("/api/v1/current-user/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
    },
  });
}
