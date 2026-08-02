import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";

const blogCollectionFormSchema = z.object({
  name: az.field(z.string()),
  description: az.field(z.string().nullable()),
});

export type BlogCollectionFormInputType = z.input<typeof blogCollectionFormSchema>;
export type BlogCollectionFormValidatedType = z.output<typeof blogCollectionFormSchema>;

interface BlogCollectionFormProps {
  onSubmit: (data: BlogCollectionFormValidatedType) => Promise<void>;
  defaultValues: BlogCollectionFormInputType;
  back: string;
}

function BlogCollectionForm({ onSubmit, defaultValues, back }: BlogCollectionFormProps) {
  const form = useAppForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      await onSubmit(value);
    },
    validators: {
      onSubmit: blogCollectionFormSchema,
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
          <form.AppField name="name">
            {(field) => {
              return <field.TextField fullWidth label="Name" />;
            }}
          </form.AppField>
          <form.AppField name="description">
            {(field) => {
              return <field.TextField fullWidth multiline minRows={5} label="Description" />;
            }}
          </form.AppField>
        </Stack>
      </CardContent>
      <CardActions>
        <Stack direction="row" spacing={2}>
          <form.AppForm>
            <form.BackButton to={back} />
            <form.SubmitButton />
          </form.AppForm>
        </Stack>
      </CardActions>
    </form>
  );
}

export default BlogCollectionForm;
