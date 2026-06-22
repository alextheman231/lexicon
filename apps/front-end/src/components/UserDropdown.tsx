import { ExternalLink } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MdCreate, MdError, MdLogout, MdManageAccounts, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryItemWrapper";
import formatError from "src/utility/errors/formatError";

function UserDropdown() {
  const { currentUser, currentUserLoading, currentUserError, unauthenticate } = useAuth();
  const theme = useTheme();

  return (
    <QueryBoundaryItemWrapper
      isLoading={currentUserLoading}
      data={currentUser}
      error={currentUserError}
      errorFallback={(error) => {
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
      nullFallback={
        <Button
          component={ExternalLink}
          href={`/api/v1/auth/google?redirect=${encodeURIComponent(window.location.origin)}`}
        >
          Sign in
        </Button>
      }
    >
      {(user) => {
        return (
          <DropdownMenuProvider>
            <DropdownMenuTrigger aria-label="User options">{user.displayName}</DropdownMenuTrigger>
            <DropdownMenu>
              <CardContent>
                <Typography variant="h6">{user.displayName}</Typography>
                <Typography variant="subtitle2">{user.username}</Typography>
              </CardContent>
              <Divider />
              <DropdownMenuItem component={InternalLink} to="/blogs/new">
                <ListItemIcon>
                  <MdCreate />
                </ListItemIcon>
                <Typography>Create Blog</Typography>
              </DropdownMenuItem>
              <Divider />
              <DropdownMenuItem component={InternalLink} to={`/users/${user.id}`}>
                <ListItemIcon>
                  <MdPerson />
                </ListItemIcon>
                <Typography>View Profile</Typography>
              </DropdownMenuItem>
              <DropdownMenuItem component={InternalLink} to="/account/edit">
                <ListItemIcon>
                  <MdManageAccounts />
                </ListItemIcon>
                <Typography>Edit Profile</Typography>
              </DropdownMenuItem>
              <Divider />
              <DropdownMenuItem onClick={unauthenticate}>
                <ListItemIcon>
                  <MdLogout />
                </ListItemIcon>
                <Typography>Sign out</Typography>
              </DropdownMenuItem>
            </DropdownMenu>
          </DropdownMenuProvider>
        );
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default UserDropdown;
