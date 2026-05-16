import type { User } from "@lexicon/models";
import type { ReactNode } from "react";

import axios from "axios";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryWrapper from "src/components/QueryBoundaryWrapper";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import { DEFAULT_ERROR_MESSAGE } from "src/utility/errors/DEFAULT_ERROR_MESSAGE";
import defaultErrorFormatters from "src/utility/errors/errorFormatters";

export interface AuthRequiredProps {
  unauthorisedMessage?: string;
  children: ReactNode | ((currentUser: User) => ReactNode);
}

function AuthRequired({
  children,
  unauthorisedMessage = "You do not have permission to access this page.",
}: AuthRequiredProps) {
  const { currentUser, currentUserLoading, currentUserError } = useAuth();

  return (
    <QueryBoundaryWrapper
      data={currentUser}
      isLoading={currentUserLoading}
      error={currentUserError}
      nullComponent={<UnauthorisedPage unauthorisedMessage={unauthorisedMessage} />}
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
    </QueryBoundaryWrapper>
  );
}

export default AuthRequired;
