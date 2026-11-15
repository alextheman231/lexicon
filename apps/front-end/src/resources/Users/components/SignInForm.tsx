import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";

const signInFormSchema = z.object({
  email: az.field(z.email()),
  password: az.field(z.string()),
});

export type SignInFormOutputType = z.output<typeof signInFormSchema>;

interface SignInFormProps {
  onSubmit: (data: SignInFormOutputType) => Promise<void>;
}

function SignInForm({ onSubmit }: SignInFormProps) {
  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(az.with(signInFormSchema).parse(value));
    },
    validators: {
      onSubmit: signInFormSchema,
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
        <Stack spacing={2}>
          <form.AppField name="email">
            {(field) => {
              return (
                <field.TextField
                  fullWidth
                  label="Email"
                  autoComplete="email"
                  type="email"
                  required
                />
              );
            }}
          </form.AppField>
          <form.AppField name="password">
            {(field) => {
              return <field.PasswordField fullWidth label="Password" required />;
            }}
          </form.AppField>
        </Stack>
      </CardContent>
      <CardActions>
        <form.AppForm>
          <form.SubmitButton label="Sign in" />
        </form.AppForm>
      </CardActions>
    </form>
  );
}

export default SignInForm;
