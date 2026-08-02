import type { User } from "@lexicon/models";

import type { BlogCollectionFormValidatedType } from "src/resources/BlogCollections/components/BlogCollectionForm";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";

import useLocation from "src/hooks/useLocation";
import BlogCollectionForm from "src/resources/BlogCollections/components/BlogCollectionForm";
import useCreateBlogCollectionMutation from "src/resources/BlogCollections/queries/useCreateBlogCollectionMutation";
import formatError from "src/utility/errors/formatError";

interface CreateBlogCollectionProps {
  currentUser: User;
}

function CreateBlogCollection({ currentUser }: CreateBlogCollectionProps) {
  const { mutateAsync: postBlogCollection } = useCreateBlogCollectionMutation();
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  async function onSubmit(data: BlogCollectionFormValidatedType) {
    try {
      const blogCollectionId = await postBlogCollection(data);
      addSnackbar("Blog collection created", { severity: "success" });
      setLocation(`/blog-collections/${blogCollectionId}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page title="Create Blog Collection" disablePadding>
      <BlogCollectionForm
        onSubmit={onSubmit}
        defaultValues={{
          name: "",
          description: "",
        }}
        back={`/users/${currentUser.id}#collections`}
      />
    </Page>
  );
}

export default CreateBlogCollection;
