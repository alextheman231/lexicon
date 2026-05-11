import type { User, UserProfileFormOutputData } from "@lexicon/models";

import { userProfileFormSchema } from "@lexicon/models";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import useAppForm from "src/hooks/useAppForm";

interface UserProfileFormProps {
  user: User;
  onSubmit: (data: UserProfileFormOutputData) => Promise<void>;
  back: string;
}

function UserProfileForm({ user, onSubmit, back }: UserProfileFormProps) {
  const form = useAppForm({
    defaultValues: {
      displayName: user.displayName ?? "",
      username: user.username,
      description: user.description ?? "",
    },
    onSubmit: async ({ value }) => {
      await onSubmit(userProfileFormSchema.parse(value));
    },
    validators: {
      onSubmit: userProfileFormSchema,
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
            <Stack direction="row" spacing={2}>
              <form.SubmitButton />
              <form.BackButton to={back} />
            </Stack>
          </Box>
        </form.AppForm>
      </CardContent>
    </form>
  );
}

export default UserProfileForm;
