import type { User } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import useLocation from "src/hooks/useLocation";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import BlogForm from "src/resources/Blogs/components/BlogForm";
import { useBlogQuery, useEditBlogMutation } from "src/resources/Blogs/queries";
import formatError from "src/utility/errors/formatError";

interface EditBlogProps {
  blogId: string;
  currentUser: User;
}

function EditBlog({ blogId, currentUser }: EditBlogProps) {
  const { data: blog, isPending, error } = useBlogQuery(blogId);
  const { addSnackbar } = useSnackbarContext();
  const { mutateAsync: updateBlog, isPending: isFormPending } = useEditBlogMutation(blogId);
  const [_, setLocation] = useLocation();

  async function onSubmit(data: BlogFormSubmitData) {
    try {
      await updateBlog({ ...data, state: BlogState.PUBLISHED });
      addSnackbar("Blog edited successfully", { severity: "success" });
      setLocation(`/blogs/${blog?.id}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <QueryBoundaryItemWrapper data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        if (blog.authorId !== currentUser.id) {
          return <UnauthorisedPage />;
        }

        return (
          <BlogForm
            defaultValues={{ title: blog.title, content: JSON.stringify(blog.content) }}
            onSubmit={onSubmit}
            back={`/blogs/${blog.id}`}
            loading={isFormPending}
          />
        );
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default EditBlog;
