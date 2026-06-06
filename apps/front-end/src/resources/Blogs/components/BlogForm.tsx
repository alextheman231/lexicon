import type { SerializedEditorState } from "lexical";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { az } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useSelector } from "@tanstack/react-store";
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

interface BlogFormMeta {
  blogState: BlogState;
}

interface BlogFormProps {
  defaultValues: BlogFormType & { content: SerializedEditorState | string };
  onPublishSubmit: (data: BlogFormSubmitData) => void | Promise<void>;
  onDraftSubmit: (data: BlogFormSubmitData) => void | Promise<void>;
  back: string;
  loading?: boolean;
}

function BlogForm({ back, defaultValues, onPublishSubmit, onDraftSubmit, loading }: BlogFormProps) {
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>(
    typeof defaultValues.content === "string" && defaultValues.content !== ""
      ? JSON.parse(defaultValues.content)
      : defaultValues.content === ""
        ? undefined
        : defaultValues.content,
  );
  const { addSnackbar } = useSnackbarContext();

  const onSubmitMeta: BlogFormMeta = { blogState: BlogState.PUBLISHED };

  const form = useAppForm({
    defaultValues: { title: defaultValues.title },
    onSubmitMeta,
    onSubmit: async ({ value, meta }) => {
      if (editorState === undefined) {
        addSnackbar("Content is required", { severity: "error" });
        return;
      }

      switch (meta.blogState) {
        case BlogState.PUBLISHED: {
          await onPublishSubmit({
            ...blogCreationSchema.parse(value),
            content: editorState,
          });
          break;
        }
        case BlogState.DRAFT: {
          await onDraftSubmit({
            ...blogCreationSchema.parse(value),
            content: editorState,
          });
          break;
        }
        case BlogState.ARCHIVED: {
          // Will be implemented later - should only do something if editing a blog.
          break;
        }
        default: {
          throw meta.blogState satisfies never;
        }
      }
    },
    validators: {
      onSubmit: blogCreationSchema,
    },
  });

  const title = useSelector(form.store, (state) => {
    return state.values.title;
  });

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <Page
        title={
          <form.AppField name="title">
            {(field) => {
              return <field.TextField label="Title" fullWidth required />;
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
              <form.SubmitButton
                loading={loading}
                disabled={title === "" && editorState === undefined}
                label="Save as Draft"
                variant="outlined"
                onClick={() => {
                  form.handleSubmit({ blogState: BlogState.DRAFT });
                }}
              />
              <form.SubmitButton
                loading={loading}
                disabled={title === "" && editorState === undefined}
                onClick={() => {
                  form.handleSubmit({ blogState: BlogState.PUBLISHED });
                }}
              />
            </form.AppForm>
          </Stack>
        </CardActions>
      </Page>
    </form>
  );
}

export default BlogForm;
