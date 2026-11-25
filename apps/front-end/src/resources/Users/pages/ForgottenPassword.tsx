import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";
import useLocation from "src/hooks/useLocation";
import useForgottenPasswordMutation from "src/resources/Users/queries/useForgottenPasswordMutation";
import formatError from "src/utility/errors/formatError";

const forgottenPasswordFormSchema = z.object({
  email: az.field(z.email()),
});

type ForgottenPasswordFormOutputType = z.output<typeof forgottenPasswordFormSchema>;

function ForgottenPassword() {
  const { mutateAsync: putForgottenPassword } = useForgottenPasswordMutation();
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(az.with(forgottenPasswordFormSchema).parse(value));
    },
    validators: {
      onSubmit: forgottenPasswordFormSchema,
    },
  });

  async function onSubmit(data: ForgottenPasswordFormOutputType) {
    try {
      await putForgottenPassword(data);
      setLocation("/users/forgotten-password/email-redirect");
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page
      title="Forgotten Password"
      subtitle="Please enter the email for your account."
      disablePadding
    >
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await form.handleSubmit();
        }}
      >
        <CardContent>
          <form.AppField name="email">
            {(field) => {
              return (
                <field.TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  autoComplete="email"
                />
              );
            }}
          </form.AppField>
        </CardContent>
        <CardActions>
          <form.AppForm>
            <form.SubmitButton />
          </form.AppForm>
        </CardActions>
      </form>
    </Page>
  );
}

export default ForgottenPassword;
