import type { User, UserProfileData } from "@lexicon/models";

import { userProfileFormSchema, userProfileInsertSchema } from "@lexicon/models";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import useAppForm from "src/hooks/useAppForm";

interface UserProfileFormProps {
  user: User;
  onSubmit: (data: UserProfileData) => Promise<void>;
}

function UserProfileForm({ user, onSubmit }: UserProfileFormProps) {
  const form = useAppForm({
    defaultValues: {
      displayName: user.displayName ?? "",
      username: user.username,
      description: user.description ?? "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(userProfileInsertSchema.parse(value));
    },
    validators: {
      onChange: userProfileFormSchema,
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
          <form.AppField name="username">
            {(field) => {
              return <field.TextField fullWidth label="Username" />;
            }}
          </form.AppField>
          <form.AppField name="displayName">
            {(field) => {
              return <field.TextField fullWidth label="Display Name" />;
            }}
          </form.AppField>
          <form.AppField name="description">
            {(field) => {
              return <field.TextField fullWidth multiline minRows={5} label="Description" />;
            }}
          </form.AppField>
        </Stack>
        <form.AppForm>
          <Box sx={{ paddingTop: 2 }}>
            <form.SubmitButton>Submit</form.SubmitButton>
          </Box>
        </form.AppForm>
      </CardContent>
    </form>
  );
}

export default UserProfileForm;
