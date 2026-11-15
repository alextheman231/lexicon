import { Page } from "@alextheman/components";
import { ErrorPage } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import { useLocation, useSearchParams } from "wouter";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";
import useResetPasswordMutation from "src/resources/Users/queries/useResetPasswordMutation";
import formatError from "src/utility/errors/formatError";

const resetPasswordFormSchema = z.object({
  password: az.field(z.string().min(8).max(256)),
});

type ResetPasswordFormOutputType = z.output<typeof resetPasswordFormSchema>;

function useFormSubmission(token: string | null) {
  const { mutateAsync: resetPassword } = useResetPasswordMutation(token ?? "");
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

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useFormSubmission(token);

  const form = useAppForm({
    defaultValues: {
      password: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(az.with(resetPasswordFormSchema).parse(value));
    },
    validators: {
      onSubmit: resetPasswordFormSchema,
    },
  });

  if (token === null) {
    return <ErrorPage title="No token present">Could not find a valid token.</ErrorPage>;
  }

  return (
    <Page title="Reset password" disablePadding>
      <form.AppForm>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            await form.handleSubmit();
          }}
        >
          <CardContent>
            <form.AppField name="password">
              {(field) => {
                return (
                  <field.PasswordWithStrengthField
                    autoComplete="new-password"
                    fullWidth
                    label="Password"
                    required
                  />
                );
              }}
            </form.AppField>
          </CardContent>
          <Divider />
          <CardActions>
            <form.SubmitButton />
          </CardActions>
        </form>
      </form.AppForm>
    </Page>
  );
}

export default ResetPassword;
