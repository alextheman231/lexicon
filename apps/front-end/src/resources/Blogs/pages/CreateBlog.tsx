import type { UserProfile } from "@lexicon/models";

import type { BlogFormSubmitData } from "src/resources/Blogs/components/BlogForm";

import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import useLocation from "src/hooks/useLocation";
import BlogForm from "src/resources/Blogs/components/BlogForm";
import useCreateBlogMutation from "src/resources/Blogs/queries/useCreateBlogMutation";
import formatError from "src/utility/errors/formatError";

interface CreateBlogProps {
  currentUser: UserProfile;
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
      const id = await uploadBlog({ ...data, state: BlogState.DRAFT });
      addSnackbar("Blog saved as draft", { severity: "success" });
      setLocation(`/blogs/${id}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  async function onSave(data: BlogFormSubmitData) {
    try {
      const id = await uploadBlog({ ...data, state: BlogState.DRAFT });
      addSnackbar("Blog saved", { severity: "success" });
      setLocation(`/blogs/${id}/edit`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <BlogForm
      defaultValues={{ title: "", content: "" }}
      onPublishSubmit={onPublishSubmit}
      onDraftSubmit={onDraftSubmit}
      onSave={onSave}
      back={`/users/${currentUser.id}`}
      loading={isPending}
    />
  );
}

export default CreateBlog;
