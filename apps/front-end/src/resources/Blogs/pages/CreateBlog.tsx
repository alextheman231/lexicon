import type { User } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import useLocation from "src/hooks/useLocation";
import BlogForm from "src/resources/Blogs/components/BlogForm";
import { useCreateBlogMutation } from "src/resources/Blogs/queries";
import formatError from "src/utility/errors/formatError";

interface CreateBlogProps {
  currentUser: User;
}

function CreateBlog({ currentUser }: CreateBlogProps) {
  const { mutateAsync: uploadBlog, isPending } = useCreateBlogMutation();
  const [_, setLocation] = useLocation();
  const { addSnackbar } = useSnackbarContext();

  async function onPublishSubmit(data: BlogFormSubmitData) {
    try {
      const id = await uploadBlog({ ...data, state: BlogState.PUBLISHED });
      addSnackbar("Blog created successfully", { severity: "success" });
      setLocation(`/blogs/${id}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  async function onDraftSubmit(data: BlogFormSubmitData) {
    try {
      await uploadBlog({ ...data, state: BlogState.DRAFT });
      addSnackbar("Blog saved as draft", { severity: "success" });
      setLocation(`/users/${currentUser.id}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <BlogForm
      defaultValues={{ title: "", content: "" }}
      onPublishSubmit={onPublishSubmit}
      onDraftSubmit={onDraftSubmit}
      back={`/users/${currentUser.id}`}
      loading={isPending}
    />
  );
}

export default CreateBlog;
