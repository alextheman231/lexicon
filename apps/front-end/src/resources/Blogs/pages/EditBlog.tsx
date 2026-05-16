import type { User } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbar } from "@alextheman/components";
import { BlogState } from "@lexicon/models";
import { useLocation } from "wouter";

import QueryBoundaryWrapper from "src/components/QueryBoundary";
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
  const { addSnackbar } = useSnackbar();
  const { mutateAsync: updateBlog, isPending: isFormPending } = useEditBlogMutation(blogId);
  const [_, setLocation] = useLocation();

  async function onSubmit(data: BlogFormSubmitData) {
    try {
      await updateBlog({ ...data, state: BlogState.PUBLISHED });
      addSnackbar("Blog edited successfully", "success");
      setLocation(`/blogs/${blog?.id}`);
    } catch (error) {
      addSnackbar(formatError(error), "error");
    }
  }

  return (
    <QueryBoundaryWrapper data={blog} isLoading={isPending} error={error}>
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
    </QueryBoundaryWrapper>
  );
}

export default EditBlog;
