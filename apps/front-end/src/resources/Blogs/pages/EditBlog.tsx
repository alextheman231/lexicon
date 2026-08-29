import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import OwnershipRequired from "src/components/OwnershipRequired";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryItemWrapper";
import useLocation from "src/hooks/useLocation";
import BlogForm from "src/resources/Blogs/components/BlogForm";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import useEditBlogMutation from "src/resources/Blogs/queries/useEditBlogMutation";
import defaultErrorFormatters from "src/utility/errors/errorFormatters";
import formatError from "src/utility/errors/formatError";

interface EditBlogProps {
  blogId: string;
}

const forbiddenMessage = "You cannot edit a blog that is not yours.";

function EditBlog({ blogId }: EditBlogProps) {
  const { data: blog, isPending, error } = useBlogQuery(blogId);
  const { addSnackbar } = useSnackbarContext();
  const { mutateAsync: updateBlog, isPending: isFormPending } = useEditBlogMutation(blogId);
  const [_, setLocation] = useLocation();

  async function onPublishSubmit(data: BlogFormSubmitData) {
    try {
      await updateBlog({ ...data, state: BlogState.PUBLISHED });
      addSnackbar("Blog edited successfully", { severity: "success" });
      setLocation(`/blogs/${blogId}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  async function onDraftSubmit(data: BlogFormSubmitData) {
    try {
      await updateBlog({ ...data, state: BlogState.DRAFT });
      addSnackbar("Blog saved as draft", { severity: "success" });
      setLocation(`/blogs/${blogId}`);
    } catch (error) {
      addSnackbar(
        formatError(error, {
          ...defaultErrorFormatters,
          FORBIDDEN_ACCESS: forbiddenMessage,
        }),
        { severity: "error" },
      );
    }
  }

  async function onSave(data: BlogFormSubmitData) {
    try {
      await updateBlog({ ...data, state: BlogState.DRAFT });
      addSnackbar("Blog saved", { severity: "success" });
    } catch (error) {
      addSnackbar(
        formatError(error, {
          ...defaultErrorFormatters,
          FORBIDDEN_ACCESS: forbiddenMessage,
        }),
        { severity: "error" },
      );
    }
  }

  return (
    <QueryBoundaryItemWrapper data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        return (
          <OwnershipRequired
            data={blog}
            ownerId={(blog) => {
              return blog.authorId;
            }}
          >
            <BlogForm
              defaultValues={{ title: blog.title, content: JSON.stringify(blog.content) }}
              onPublishSubmit={onPublishSubmit}
              onDraftSubmit={onDraftSubmit}
              onSave={onSave}
              back={`/blogs/${blog.id}`}
              loading={isFormPending}
            />
          </OwnershipRequired>
        );
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default EditBlog;
