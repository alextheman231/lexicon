import type { DropdownMenuItemProps } from "@alextheman/components/DropdownMenu";

import type { BlogCollectionsFormValidatedType } from "src/resources/BlogCollections/components/BlogCollectionsForm";

import { DropdownMenuItem, useDropdownMenuContext } from "@alextheman/components/DropdownMenu";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { useState } from "react";

import BlogCollectionsForm from "src/resources/BlogCollections/components/BlogCollectionsForm";
import useBlogAssignmentToBlogCollectionsMutation from "src/resources/BlogCollections/queries/useBlogAssignmentToBlogCollectionsMutation";
import formatError from "src/utility/errors/formatError";

interface AddToCollectionDropdownMenuItemProps extends Omit<DropdownMenuItemProps, "onClick"> {
  blogId: string;
}

function AddToCollectionDropdownMenuItem({
  blogId,
  ...props
}: AddToCollectionDropdownMenuItemProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { closeMenu } = useDropdownMenuContext();
  const { mutateAsync: assignBlogToCollections } =
    useBlogAssignmentToBlogCollectionsMutation(blogId);
  const { addSnackbar } = useSnackbarContext();

  async function onSubmit(data: BlogCollectionsFormValidatedType) {
    try {
      await assignBlogToCollections({ blogCollectionIds: data.blogCollectionIds });
      addSnackbar("Blog added successfully.", { severity: "success" });
      setOpen(false);
      closeMenu();
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <>
      <DropdownMenuItem
        onClick={(event) => {
          event.preventDefault();
          setOpen(true);
        }}
        {...props}
      >
        Add to collection
      </DropdownMenuItem>
      <BlogCollectionsForm
        open={open}
        onSubmit={onSubmit}
        onClose={() => {
          setOpen(false);
          closeMenu();
        }}
        blogId={blogId}
      />
    </>
  );
}

export default AddToCollectionDropdownMenuItem;
