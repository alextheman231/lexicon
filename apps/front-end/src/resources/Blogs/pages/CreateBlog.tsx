import type { User } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbar } from "@alextheman/components";
import { BlogState } from "@lexicon/models";
import { useLocation } from "wouter";

import BlogForm from "src/resources/Blogs/components/BlogForm";
import { useCreateBlogMutation } from "src/resources/Blogs/queries";
import formatError from "src/utility/errors/formatError";

interface CreateBlogProps {
  currentUser: User;
}

function CreateBlog({ currentUser }: CreateBlogProps) {
  const { mutateAsync: uploadBlog, isPending } = useCreateBlogMutation();
  const [_, setLocation] = useLocation();
  const { addSnackbar } = useSnackbar();

  async function onSubmit(data: BlogFormSubmitData) {
    try {
      const id = await uploadBlog({ ...data, state: BlogState.PUBLISHED });
      addSnackbar("Blog created successfully", "success");
      setLocation(`/blogs/${id}`);
    } catch (error) {
      addSnackbar(formatError(error), "error");
    }
  }

  return (
    <BlogForm
      defaultValues={{ title: "", content: "" }}
      onSubmit={onSubmit}
      back={`/users/${currentUser.id}`}
      loading={isPending}
    />
  );
}

export default CreateBlog;
