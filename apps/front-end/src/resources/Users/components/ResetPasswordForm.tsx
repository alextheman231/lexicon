import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";

const resetPasswordFormSchema = z.object({
  password: az.field(z.string().min(8).max(256)),
});

export type ResetPasswordFormOutputType = z.output<typeof resetPasswordFormSchema>;

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormOutputType) => void | Promise<void>;
}

function ResetPasswordForm({ onSubmit }: ResetPasswordFormProps) {
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
