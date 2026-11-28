import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";

const resetPasswordFormSchema = z.object({
  password: az.field(
    z
      .string()
      .min(8, { error: "The password is too short. Please try a longer password." })
      .max(256, { error: "The password is too long. Please try a shorter password." }),
  ),
  passwordAgain: az.field(z.string()),
});

export type ResetPasswordFormOutputType = z.output<typeof resetPasswordFormSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormOutputType) => void | Promise<void>;
}

function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
  const form = useAppForm({
    defaultValues: {
      password: "",
      passwordAgain: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(az.with(resetPasswordFormSchema).parse(value));
    },
    validators: {
      onSubmit: resetPasswordFormSchema,
    },
  });

  return (
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
        <form.AppField name="passwordAgain">
          {(field) => {
            return (
              <field.PasswordField
                autoComplete="new-password"
                fullWidth
                label="Confirm Password"
                required
              />
            );
          }}
        </form.AppField>
      </CardContent>
      <Divider />
      <CardActions>
        <form.AppForm>
          <form.SubmitButton />
        </form.AppForm>
      </CardActions>
    </form>
  );
}

export default ResetPasswordForm;
