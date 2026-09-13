import type { UserInfoFormValidatedType } from "src/resources/Users/components/UserInfoForm";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";

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
