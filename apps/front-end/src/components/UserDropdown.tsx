import { ExternalLink } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
  DropdownMenuTrigger,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { useTheme } from "@mui/material/styles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { MdCreate, MdError, MdLogin, MdLogout, MdManageAccounts, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import useMetadataQuery from "src/queries/useMetadataQuery";
import formatError from "src/utility/errors/formatError";

function UserDropdown() {
  const { currentUser, currentUserLoading, currentUserError, unauthenticate } = useAuth();
  const QueryBoundaryUser = createObjectQueryBoundary({
    query: { data: currentUser, isLoading: currentUserLoading, error: currentUserError },
  });
  const { data, isPending, error } = useMetadataQuery();
  const QueryBoundaryMetadata = createObjectQueryBoundary({
    query: { data, isLoading: isPending, error },
  });
  const theme = useTheme();

  const dropdownTrigger = (
    <DropdownMenuTrigger aria-label="User options">
      <QueryBoundaryUser.Data nullFallback="Options">
        {(user) => {
          return user.displayName ?? user.username;
        }}
      </QueryBoundaryUser.Data>
    </DropdownMenuTrigger>
  );

  return (
    <DropdownMenuProvider>
      <QueryBoundaryUser.Error>
        {(error) => {
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
      </QueryBoundaryUser.Error>
      <QueryBoundaryUser.Data nullFallback={dropdownTrigger}>
        {dropdownTrigger}
      </QueryBoundaryUser.Data>
      <DropdownMenu>
        <QueryBoundaryUser.Data
          nullFallback={
            <DropdownMenuItem
              component={ExternalLink}
              href={`/api/v1/auth/google?redirect=${encodeURIComponent(window.location.origin)}`}
            >
              <ListItemIcon>
                <MdLogin />
              </ListItemIcon>
              <Typography>Sign in</Typography>
            </DropdownMenuItem>
          }
        >
          {(user) => {
            return (
              <CardContent>
                <Typography variant="h6">{user.displayName}</Typography>
                <Typography variant="subtitle2">{user.username}</Typography>
              </CardContent>
            );
          }}
        </QueryBoundaryUser.Data>
        <Divider />
        <QueryBoundaryUser.Data nullFallback={null}>
          {(user) => {
            return (
              <>
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
                <Divider />
              </>
            );
          }}
        </QueryBoundaryUser.Data>
        <QueryBoundaryMetadata.Data>
          {(metadata) => {
            return (
              <>
                <CardContent sx={{ overflowWrap: "break-word" }}>
                  <Typography variant="h6">Metadata</Typography>
                  <Typography variant="body2">
                    Current SHA: {metadata.commitHash ?? "unknown"}
                  </Typography>
                </CardContent>
                <Divider />
              </>
            );
          }}
        </QueryBoundaryMetadata.Data>
      </DropdownMenu>
    </DropdownMenuProvider>
  );
}

export default UserDropdown;
