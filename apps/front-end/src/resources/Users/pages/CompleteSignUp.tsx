import { Page } from "@alextheman/components";
import { ErrorPage } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { az } from "@alextheman/utility";
import { useLocation, useSearchParams } from "wouter";
import z from "zod";

import ResetPasswordForm from "src/resources/Users/components/ResetPasswordForm";
import useCompleteSignUpMutation from "src/resources/Users/queries/useCompleteSignUpMutation";
import formatError from "src/utility/errors/formatError";

const resetPasswordFormSchema = z.object({
  password: az.field(z.string().min(8).max(256)),
});

type ResetPasswordFormOutputType = z.output<typeof resetPasswordFormSchema>;

function useFormSubmission(token: string | null) {
  const { mutateAsync: resetPassword } = useCompleteSignUpMutation(token ?? "");
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  return async (data: ResetPasswordFormOutputType) => {
    try {
      await resetPassword(data.password);
      addSnackbar("Password reset", { severity: "success" });
      setLocation("/users/sign-in");
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  };
}

function CompleteSignUp() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useFormSubmission(token);

  if (token === null) {
    return <ErrorPage title="No token present">Could not find a valid token.</ErrorPage>;
  }

  return (
    <Page title="Complete your sign-up" subtitle="Please enter a password here." disablePadding>
      <ResetPasswordForm onSubmit={onSubmit} />
    </Page>
  );
}

export default CompleteSignUp;
