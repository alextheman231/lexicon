import { ExternalLink, QueryBoundary } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
  InternalLink,
} from "@alextheman/components/v7";
import Button from "@mui/material/Button";

import { useAuth } from "src/AuthContextProvider";

function UserDropdown() {
  const { currentUser, currentUserLoading, unauthenticate } = useAuth();

  return (
    <QueryBoundary
      isLoading={currentUserLoading}
      data={currentUser}
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
              <DropdownMenuItem component={InternalLink} to={`/users/${user.id}`}>
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem component={InternalLink} to="/account/edit">
                Edit Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={unauthenticate}>Sign out</DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuProvider>
        );
      }}
    </QueryBoundary>
  );
}

export default UserDropdown;
