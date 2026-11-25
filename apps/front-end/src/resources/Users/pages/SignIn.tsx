import type { SignInFormOutputType } from "src/resources/Users/components/SignInForm";

import { ExternalLink, Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import useLocation from "src/hooks/useLocation";
import SignInForm from "src/resources/Users/components/SignInForm";
import useSignInMutation from "src/resources/Users/queries/useSignInMutation";
import formatError from "src/utility/errors/formatError";

function SignIn() {
  const { mutateAsync: signIn } = useSignInMutation();
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  async function onSubmit(data: SignInFormOutputType) {
    try {
      await signIn(data);
      addSnackbar("Signed in successfully", { severity: "success" });
      setLocation("/");
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page title="Sign In" disablePadding>
      <SignInForm onSubmit={onSubmit} />
      <Divider>Or</Divider>
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
        <Typography>
          Forgot your password?{" "}
          <InternalLink to="/users/forgotten-password">
            Click here to reset your password.
          </InternalLink>
        </Typography>
      </CardContent>
    </Page>
  );
}

export default SignIn;
