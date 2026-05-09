import type { BlogUpdateData, User } from "@lexicon/models";
import type { SerializedEditorState } from "lexical";

import { Page, useSnackbar } from "@alextheman/components";
import { az } from "@alextheman/utility";
import { BlogState } from "@lexicon/models";
import { useState } from "react";
import { useLocation } from "wouter";
import z from "zod";

import QueryBoundary from "src/components/QueryBoundary";
import useAppForm from "src/hooks/useAppForm";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import BlogEditor from "src/resources/Blogs/components/BlogEditor";
import { useBlogQuery, useEditBlogMutation } from "src/resources/Blogs/queries";
import formatError from "src/utility/errors/formatError";

interface EditBlogProps {
  blogId: string;
  currentUser: User;
}

const blogUpdateSchema = z.object({
  title: az.field(z.string()),
});

function EditBlog({ blogId, currentUser }: EditBlogProps) {
  const { data: blog, isPending, error } = useBlogQuery(blogId);
  const [editorState, setEditorState] = useState<SerializedEditorState | undefined>();
  const { addSnackbar } = useSnackbar();
  const { mutateAsync: updateBlog } = useEditBlogMutation(blogId);
  const [_, setLocation] = useLocation();

  async function onSubmit(data: BlogUpdateData) {
    try {
      const id = await updateBlog(data);
      addSnackbar("Blog created successfully", "success");
      setLocation(`/blogs/${id}`);
    } catch (error) {
      addSnackbar(formatError(error), "error");
    }
  }

  const form = useAppForm({
    defaultValues: {
      title: blog?.title ?? "",
    },
    onSubmit: async ({ value }) => {
      if (editorState === undefined) {
        addSnackbar("Content is required", "error");
        return;
      }
      await onSubmit({
        ...blogUpdateSchema.parse(value),
        state: BlogState.PUBLISHED,
        content: editorState,
      });
    },
    validators: {
      onSubmit: blogUpdateSchema,
    },
  });

  return (
    <QueryBoundary data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        if (blog.authorId !== currentUser.id) {
          return <UnauthorisedPage />;
        }

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
            >
              <BlogEditor
                initialContent={JSON.stringify(blog.content)}
                setEditorState={setEditorState}
              />
            </Page>
          </form>
        );
      }}
    </QueryBoundary>
  );
}

export default EditBlog;
