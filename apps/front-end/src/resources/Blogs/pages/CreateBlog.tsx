import type { BlogInsertData } from "@lexicon/models";
import type { SerializedEditorState } from "lexical";

import { Page, useSnackbar } from "@alextheman/components";
import { az } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { useLocation } from "wouter";
import z from "zod";

import { useAuth } from "src/AuthContextProvider";
import useAppForm from "src/hooks/useAppForm";
import BlogEditor from "src/resources/Blogs/components/BlogEditor";
import { useCreateBlogMutation } from "src/resources/Blogs/queries";
import formatError from "src/utility/errors/formatError";

const blogCreationSchema = z.object({
  title: az.field(z.string()),
});

function CreateBlog() {
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>();
  const { mutateAsync: uploadBlog, isPending } = useCreateBlogMutation();
  const { currentUser } = useAuth();
  const [_, setLocation] = useLocation();
  const { addSnackbar } = useSnackbar();

  async function onSubmit(data: BlogInsertData) {
    try {
      const id = await uploadBlog(data);
      addSnackbar("Blog created successfully", "success");
      setLocation(`/blogs/${id}`);
    } catch (error) {
      addSnackbar(formatError(error), "error");
    }
  }

  const form = useAppForm({
    defaultValues: {
      title: "",
    },
    onSubmit: async ({ value }) => {
      if (editorState === undefined) {
        addSnackbar("Content is required", "error");
        return;
      }
      await onSubmit({
        ...blogCreationSchema.parse(value),
        state: BlogState.PUBLISHED,
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
          <BlogEditor setEditorState={setEditorState} />
        </CardContent>
        <Divider />
        <CardActions>
          <Stack direction="row" spacing={2}>
            <form.AppForm>
              <form.BackButton to={`/users/${currentUser?.id}`} />
              <form.SubmitButton disabled={editorState === undefined} loading={isPending} />
            </form.AppForm>
          </Stack>
        </CardActions>
      </Page>
    </form>
  );
}

export default CreateBlog;
