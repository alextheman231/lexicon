import type { UserProfile } from "@lexicon/models";
import type { ReactNode } from "react";

import axios from "axios";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryItemWrapper";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import DEFAULT_ERROR_MESSAGE from "src/utility/errors/DEFAULT_ERROR_MESSAGE";
import defaultErrorFormatters from "src/utility/errors/errorFormatters";

export interface AuthRequiredProps {
  unauthorisedMessage?: string;
  children: ReactNode | ((currentUser: UserProfile) => ReactNode);
}

function AuthRequired({
  children,
  unauthorisedMessage = "You do not have permission to access this page.",
}: AuthRequiredProps) {
  const { currentUser, currentUserLoading, currentUserError } = useAuth();

  return (
    <QueryBoundaryItemWrapper
      data={currentUser}
      isLoading={currentUserLoading}
      error={currentUserError}
      nullFallback={<UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />}
      codeErrorMap={{ ...defaultErrorFormatters, AUTH_REQUIRED: unauthorisedMessage }}
      errorFunction={(error) => {
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          return unauthorisedMessage;
        }
        return DEFAULT_ERROR_MESSAGE;
      }}
    >
      {(user) => {
        return typeof children === "function" ? children(user) : children;
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default AuthRequired;
