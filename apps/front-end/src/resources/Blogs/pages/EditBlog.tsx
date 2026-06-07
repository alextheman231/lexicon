import type { User } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import useLocation from "src/hooks/useLocation";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import BlogForm from "src/resources/Blogs/components/BlogForm";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import useEditBlogMutation from "src/resources/Blogs/queries/useEditBlogMutation";
import defaultErrorFormatters from "src/utility/errors/errorFormatters";
import formatError from "src/utility/errors/formatError";

interface EditBlogProps {
  blogId: string;
  currentUser: User;
}

const forbiddenMessage = "You cannot edit a blog that is not yours.";

function EditBlog({ blogId, currentUser }: EditBlogProps) {
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

  return (
    <QueryBoundaryItemWrapper data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        if (blog.authorId !== currentUser.id) {
          return <UnauthorisedPage unauthorisedMessage={forbiddenMessage} />;
        }

        return (
          <BlogForm
            defaultValues={{ title: blog.title, content: JSON.stringify(blog.content) }}
            onPublishSubmit={onPublishSubmit}
            onDraftSubmit={onDraftSubmit}
            back={`/blogs/${blog.id}`}
            loading={isFormPending}
          />
        );
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default EditBlog;
