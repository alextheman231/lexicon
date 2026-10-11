import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";

const userInfoFormSchema = z.object({
  email: az.field(z.string()),
  username: az.field(z.string()),
  displayName: az.field(z.string().nullable()),
  description: az.field(z.string().nullable()),
  dateOfBirth: az.field(az.fieldDate()),
});

export type UserInfoFormInputType = z.input<typeof userInfoFormSchema>;
export type UserInfoFormValidatedType = z.output<typeof userInfoFormSchema>;

interface UserInfoFormProps {
  defaultValues: UserInfoFormInputType;
  onSubmit: (data: UserInfoFormValidatedType) => Promise<void>;
  back: string;
}

function UserInfoForm({ defaultValues, onSubmit, back }: UserInfoFormProps) {
  const form = useAppForm({
    validators: {
      onSubmit: userInfoFormSchema,
    },
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(az.with(userInfoFormSchema).parse(value));
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
              return <field.TextField fullWidth required label="Email" />;
            }}
          </form.AppField>
          <form.AppField name="username">
            {(field) => {
              return (
                <field.TextField
                  fullWidth
                  required
                  label="Username"
                  helperText="This is a name we can use to uniquely identify you on the platform. It must not be shared with any other user."
                />
              );
            }}
          </form.AppField>
          <form.AppField name="displayName">
            {(field) => {
              return (
                <field.TextField
                  fullWidth
                  label="Display name"
                  helperText="This is your preferred account name. It does not need to be unique on the platform."
                />
              );
            }}
          </form.AppField>
          <form.AppField name="description">
            {(field) => {
              return <field.TextField fullWidth multiline minRows={5} label="Description" />;
            }}
          </form.AppField>
          <form.AppField name="dateOfBirth">
            {(field) => {
              return (
                <field.DateField
                  fullWidth
                  label="Date of birth"
                  helperText="We use this to verify your age."
                />
              );
            }}
          </form.AppField>
        </Stack>
      </CardContent>
      <Divider />
      <form.AppForm>
        <CardActions>
          <form.BackButton to={back} />
          <form.SubmitButton />
        </CardActions>
      </form.AppForm>
    </form>
  );
}

export default UserInfoForm;
