import { InternalLink } from "@alextheman/components/routing";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";

interface UserLinkProps {
  userId: string;
  username: string;
  displayName: string | null;
  profilePictureUrl: string | null;
}

function UserLink({ userId, username, displayName, profilePictureUrl }: UserLinkProps) {
  const avatar = <Avatar src={profilePictureUrl ?? ""} sx={{ width: 25, height: 25 }} />;

  if (displayName === null) {
    return (
      <Stack direction="row" spacing={2}>
        {avatar}
        <InternalLink to={`/users/${userId}`}>{username}</InternalLink>
      </Stack>
    );
  }
  return (
    <Grid container spacing={1}>
      {avatar}
      <Grid>
        {displayName} (<InternalLink to={`/users/${userId}`}>{username}</InternalLink>)
      </Grid>
    </Grid>
  );
}

export default UserLink;
