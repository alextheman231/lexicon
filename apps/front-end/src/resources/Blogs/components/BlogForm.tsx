import type { SerializedEditorState } from "lexical";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { az } from "@alextheman/utility";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import z from "zod";

import useAppForm from "src/hooks/useAppForm";
import BlogEditor from "src/resources/Blogs/components/BlogEditor";

const blogCreationSchema = z.object({
  title: az.field(z.string()),
});

export type BlogFormType = z.input<typeof blogCreationSchema>;
export type BlogFormValidatedType = z.output<typeof blogCreationSchema>;

export type BlogFormSubmitData = BlogFormValidatedType & { content: SerializedEditorState };

interface BlogFormProps {
  defaultValues: BlogFormType & { content: SerializedEditorState | string };
  onSubmit: (data: BlogFormSubmitData) => void | Promise<void>;
  back: string;
  loading?: boolean;
}

function BlogForm({ back, defaultValues, onSubmit, loading }: BlogFormProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>();
  const { addSnackbar } = useSnackbarContext();

  const form = useAppForm({
    defaultValues: { title: defaultValues.title },
    onSubmit: async ({ value }) => {
      if (editorState === undefined) {
        addSnackbar("Content is required", { severity: "error" });
        return;
      }
      await onSubmit({
        ...blogCreationSchema.parse(value),
        content: editorState,
      });
    },
    validators: {
      onSubmit: blogCreationSchema,
    },
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        await form.handleSubmit();
      }}
    >
      <Page
        title={
          <form.AppField name="title">
            {(field) => {
              return <field.TextField label="Title" fullWidth />;
            }}
          </form.AppField>
        }
        disablePadding
      >
        <CardContent>
          <BlogEditor initialContent={defaultValues.content} setEditorState={setEditorState} />
        </CardContent>
        <Divider />
        <CardActions>
          <Stack direction="row" spacing={2}>
            <form.AppForm>
              <form.BackButton to={back} />
              <form.SubmitButton disabled={editorState === undefined} loading={loading} />
            </form.AppForm>
          </Stack>
        </CardActions>
      </Page>
    </form>
  );
}

export default BlogForm;
