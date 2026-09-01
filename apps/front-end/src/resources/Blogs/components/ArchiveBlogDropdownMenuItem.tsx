import type { DropdownMenuItemProps } from "@alextheman/components/DropdownMenu";

import { DropdownMenuItem, useDropdownMenuContext } from "@alextheman/components/DropdownMenu";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";
import { useState } from "react";

import ArchiveBlogDialog from "src/resources/Blogs/components/ArchiveBlogDialog";
import useEditBlogStateMutation from "src/resources/Blogs/queries/useEditBlogStateMutation";
import formatError from "src/utility/errors/formatError";

interface ArchiveBlogDropdownMenuItemProps extends Omit<DropdownMenuItemProps, "onClick"> {
  blogId: string;
}

function ArchiveBlogDropdownMenuItem({ blogId, ...props }: ArchiveBlogDropdownMenuItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { mutateAsync: updateBlog, isPending } = useEditBlogStateMutation(blogId);
  const { addSnackbar } = useSnackbarContext();
  const { closeMenu } = useDropdownMenuContext();

  async function handleArchive() {
    try {
      await updateBlog({
        state: BlogState.ARCHIVED,
      });
      addSnackbar("Blog archived", { severity: "success" });
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
          setIsDialogOpen(true);
        }}
        {...props}
      >
        Archive Blog
      </DropdownMenuItem>
      <ArchiveBlogDialog
        open={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          closeMenu();
        }}
        onSubmit={handleArchive}
        blogId={blogId}
        disabled={isPending}
      />
    </>
  );
}

export default ArchiveBlogDropdownMenuItem;
