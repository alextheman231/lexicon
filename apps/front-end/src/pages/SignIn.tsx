import { ExternalLink, Page } from "@alextheman/components";
import Button from "@mui/material/Button";

function SignIn() {
  return (
    <Page title="Sign In">
      <Button
        sx={{ backgroundColor: "red" }}
        variant="contained"
        component={ExternalLink}
        href={`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/google?redirect=${encodeURIComponent(window.location.origin)}`}
      >
        Sign in with Google
      </Button>
    </Page>
  );
}

export default SignIn;
