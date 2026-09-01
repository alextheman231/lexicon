import type { Blog, BlogSummary, BlogView } from "@lexicon/models";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import { BlogState } from "@lexicon/models";

import { useAuth } from "src/AuthContextProvider";
import DropdownMenuIconButton from "src/components/DropdownIconButton";
import AddToCollectionDropdownMenuItem from "src/resources/BlogCollections/components/AddToCollectionDropdownMenuItem";
import ArchiveBlogDropdownMenuItem from "src/resources/Blogs/components/ArchiveBlogDropdownMenuItem";
import useEditBlogStateMutation from "src/resources/Blogs/queries/useEditBlogStateMutation";
import formatError from "src/utility/errors/formatError";

interface BlogDropdownProps {
  blog: Blog | BlogView | BlogSummary;
  extraItems?: {
    insertLocation: "top" | "bottom";
    items: ReactNode;
  };
}

function BlogDropdown({ blog, extraItems }: BlogDropdownProps) {
  const { currentUser } = useAuth();
  const { mutateAsync: changeBlogState } = useEditBlogStateMutation(blog.id);
  const { addSnackbar } = useSnackbarContext();

  async function handleUnarchive(state: Exclude<BlogState, "archived">) {
    try {
      await changeBlogState({ state });
      addSnackbar("Blog restored successfully.", { severity: "success" });
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <DropdownMenuProvider>
      <DropdownMenuIconButton aria-label="Blog options" />
      <DropdownMenu>
        {extraItems && extraItems.insertLocation === "top" ? extraItems.items : null}
        {currentUser?.id === blog.authorId ? (
          <>
            <DropdownMenuItem component={InternalLink} to={`/blogs/${blog.id}/revisions`}>
              View Revisions
            </DropdownMenuItem>
            <DropdownMenuItem component={InternalLink} to={`/blogs/${blog.id}/edit`}>
              Edit
            </DropdownMenuItem>
            {blog.state !== BlogState.ARCHIVED ? (
              <ArchiveBlogDropdownMenuItem blogId={blog.id} />
            ) : null}
          </>
        ) : null}
        {blog.state !== BlogState.ARCHIVED ? (
          <AddToCollectionDropdownMenuItem blogId={blog.id} />
        ) : (
          <>
            <DropdownMenuItem
              onClick={async () => {
                await handleUnarchive(BlogState.DRAFT);
              }}
            >
              Unarchive as Draft
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                await handleUnarchive(BlogState.PUBLISHED);
              }}
            >
              Unarchive and Publish
            </DropdownMenuItem>
          </>
        )}
        {extraItems && extraItems.insertLocation === "bottom" ? extraItems.items : null}
      </DropdownMenu>
    </DropdownMenuProvider>
  );
}

export default BlogDropdown;
