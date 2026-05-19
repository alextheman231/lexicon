import { ExternalLink } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
  InternalLink,
} from "@alextheman/components/v7";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import { MdError } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import formatError from "src/utility/errors/formatError";

function UserDropdown() {
  const { currentUser, currentUserLoading, currentUserError, unauthenticate } = useAuth();
  const theme = useTheme();

  return (
    <QueryBoundaryWrapper
      isLoading={currentUserLoading}
      data={currentUser}
      error={currentUserError}
      errorComponent={(error) => {
        const errorMessage = formatError(error);

        return (
          <Box sx={{ paddingTop: 0.3 }}>
            <Tooltip title={errorMessage}>
              <Box
                component="span"
                tabIndex={0}
                sx={{
                  display: "inline-flex",
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineOffset: "2px",
                  },
                }}
              >
                <MdError
                  size={30}
                  color={theme.palette.error.main}
                  aria-label={errorMessage}
                  role="img"
                />
              </Box>
            </Tooltip>
          </Box>
        );
      }}
      nullableComponent={
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
    </QueryBoundaryWrapper>
  );
}

export default UserDropdown;
