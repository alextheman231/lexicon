import { ExternalLink, Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

function SignIn() {
  return (
    <Page title="Sign In" disablePadding>
      <CardContent>
        <Button
          sx={{ backgroundColor: "red" }}
          variant="contained"
          component={ExternalLink}
          href={`/api/v1/auth/google?redirect=${encodeURIComponent(window.location.origin)}`}
        >
          Sign in with Google
        </Button>
      </CardContent>
      <Divider />
      <CardContent>
        <Typography>
          Don't have an account yet? <InternalLink to="/users/sign-up">Sign up here.</InternalLink>
        </Typography>
      </CardContent>
    </Page>
  );
}

export default SignIn;
