import type { DropdownMenuItemProps } from "@alextheman/components/DropdownMenu";

import { DropdownMenuItem, useDropdownMenuContext } from "@alextheman/components/DropdownMenu";
import { useState } from "react";

import BlogCollectionsForm from "src/resources/BlogCollections/components/BlogCollectionsForm";

interface AddToCollectionDropdownMenuItemProps extends Omit<DropdownMenuItemProps, "onClick"> {
  blogId: string;
}

function AddToCollectionDropdownMenuItem({
  blogId,
  ...props
}: AddToCollectionDropdownMenuItemProps) {
  const [open, setOpen] = useState<boolean>(false);
  const { closeMenu } = useDropdownMenuContext();

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
