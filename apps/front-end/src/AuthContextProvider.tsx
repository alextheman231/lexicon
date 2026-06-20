import type { ContextHookOptions } from "@alextheman/components";
import type { OptionalOnCondition } from "@alextheman/utility";
import type { User } from "@lexicon/models";
import type { ReactNode } from "react";

import { DataError } from "@alextheman/utility/v6";
import { createContext, use, useCallback, useMemo } from "react";

import useQueryInvalidation from "src/hooks/query/useQueryInvalidation";
import useCurrentUserQuery from "src/resources/Users/queries/useCurrentUserQuery";
import useLogoutMutation from "src/resources/Users/queries/useLogoutMutation";

export interface AuthContextValue {
  authenticate: () => void;
  currentUser: User | null | undefined;
  currentUserLoading: boolean;
  currentUserError: unknown;
  unauthenticate: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth<Strict extends boolean = true>({
  strict = true as Strict,
}: ContextHookOptions<Strict> = {}): OptionalOnCondition<Strict, AuthContextValue> {
  const context = use(AuthContext);
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
  const { data: user, isPending, error } = useCurrentUserQuery();
  const { mutateAsync: logout } = useLogoutMutation();
  const invalidateAuth = useQueryInvalidation("auth");

  const currentUser: User | null | undefined = isPending ? undefined : user;

  const unauthenticate = useCallback(async () => {
    await logout();
  }, [logout]);

  const authenticate = useCallback(async () => {
    await invalidateAuth();
  }, [invalidateAuth]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      authenticate,
      currentUser,
      currentUserLoading: isPending,
      currentUserError: error,
      unauthenticate,
    };
  }, [authenticate, currentUser, isPending, unauthenticate, error]);

  return <AuthContext value={value}>{children}</AuthContext>;
}

export default AuthContextProvider;
