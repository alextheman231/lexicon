import type { ContextHookOptions } from "@alextheman/components";
import type { OptionalOnCondition } from "@alextheman/utility";
import type { User } from "@lexicon/models";
import type { ReactNode } from "react";

import { DataError } from "@alextheman/utility/v6";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useMemo } from "react";

import { useCurrentUserQuery, useLogoutMutation } from "src/resources/Users/queries";
import queryKeys from "src/utility/queryKeys";

export interface AuthContextValue {
  authenticate: () => void;
  currentUser: User | null | undefined;
  currentUserLoading: boolean;
  unauthenticate: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth<Strict extends boolean = true>({
  strict = true as Strict,
}: ContextHookOptions<Strict> = {}): OptionalOnCondition<Strict, AuthContextValue> {
  const context = useContext(AuthContext);
  if (strict && !context) {
    throw new DataError(
      { strict, context },
      "AUTH_CONTEXT_NOT_FOUND",
      "Could not find the AuthContext. Please double-check that it is present.",
    );
  }
  return context as OptionalOnCondition<Strict, AuthContextValue>;
}

export interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const queryClient = useQueryClient();
  const { data: user, isPending } = useCurrentUserQuery();
  const { mutateAsync: logout } = useLogoutMutation();

  const currentUser: User | null | undefined = isPending ? undefined : user;

  const unauthenticate = useCallback(async () => {
    await logout();
  }, [logout]);

  const authenticate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth() });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    return { authenticate, currentUser, currentUserLoading: isPending, unauthenticate };
  }, [authenticate, currentUser, isPending, unauthenticate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
