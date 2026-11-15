import type { UserInfoFormValidatedType } from "src/resources/Users/components/UserInfoForm";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import Alert from "@mui/material/Alert";

import useLocation from "src/hooks/useLocation";
import UserInfoForm from "src/resources/Users/components/UserInfoForm";
import useSignUpMutation from "src/resources/Users/queries/useSignUpMutation";
import formatError from "src/utility/errors/formatError";

function SignUp() {
  const { mutateAsync: createUser } = useSignUpMutation();
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  async function onSubmit(data: UserInfoFormValidatedType) {
    try {
      const userId = await createUser(data);
      setLocation(`/users/sign-up/${userId}/email-redirect`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page title="Sign up to Lexicon" subtitle="Please enter your details below" disablePadding>
      <Alert severity="info">
        NOTE: Email delivery is temporarily unavailable while we await production access from our
        email provider. In the meantime, please contact AlexMan123456 on GitHub to request
        assistance completing your registration after submitting the form.
      </Alert>
      <UserInfoForm
        defaultValues={{
          email: "",
          username: "",
          displayName: "",
          description: "",
          dateOfBirth: "",
        }}
        onSubmit={onSubmit}
        back="/"
      />
    </Page>
  );
}

export default SignUp;
