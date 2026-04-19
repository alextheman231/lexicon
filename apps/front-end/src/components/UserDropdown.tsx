import { ExternalLink, Loader } from "@alextheman/components";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useAuth } from "src/AuthContextProvider";

function UserDropdown() {
  const { signedInUser, signedInUserLoading } = useAuth();

  return (
    <Loader
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
        return <Typography>{user.username}</Typography>;
      }}
    </Loader>
  );
}

export default UserDropdown;
