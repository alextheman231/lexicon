import type { ResetPasswordFormOutputType } from "src/resources/Auth/components/ResetPasswordForm";

import { Page } from "@alextheman/components";
import { ErrorPage } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { useSearchParams } from "wouter";

import useLocation from "src/hooks/useLocation";
import ResetPasswordForm from "src/resources/Auth/components/ResetPasswordForm";
import useResetPasswordMutation from "src/resources/Auth/queries/useResetPasswordMutation";
import formatError from "src/utility/errors/formatError";

function useFormSubmission(token: string | null) {
  const { mutateAsync: resetPassword } = useResetPasswordMutation(token ?? "");
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  return async (data: ResetPasswordFormOutputType) => {
    try {
      await resetPassword(data.password);
      addSnackbar("Password reset", { severity: "success" });
      setLocation("/auth/sign-in");
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  };
}

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useFormSubmission(token);

  if (token === null) {
    return <ErrorPage title="No token present">Could not find a valid token.</ErrorPage>;
  }

  return (
    <Page title="Reset password" subtitle="Please enter your new password here." disablePadding>
      <ResetPasswordForm onSubmit={onSubmit} />
    </Page>
  );
}

export default ResetPassword;
