import { ExternalLink, QueryBoundary } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
} from "@alextheman/components/v7";
import Button from "@mui/material/Button";

import { useAuth } from "src/AuthContextProvider";

function UserDropdown() {
  const { signedInUser, signedInUserLoading, unauthenticate } = useAuth();

  return (
    <QueryBoundary
      isLoading={signedInUserLoading}
      data={signedInUser}
      nullComponent={
        <Button
          component={ExternalLink}
          href={`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google?redirect=${encodeURIComponent(window.location.origin)}`}
        >
          Sign in
        </Button>
      }
    >
      {(user) => {
        return (
          <DropdownMenuProvider>
            <DropdownMenuTrigger>{user.displayName}</DropdownMenuTrigger>
            <DropdownMenu>
              <DropdownMenuItem onClick={unauthenticate}>Sign out</DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuProvider>
        );
      }}
    </QueryBoundary>
  );
}

export default UserDropdown;
