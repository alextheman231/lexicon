import type { Blog, BlogSummary, BlogView } from "@lexicon/models";
import type { ReactNode } from "react";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import { BlogState } from "@lexicon/models";

import { useAuth } from "src/AuthContextProvider";
import DropdownMenuIconButton from "src/components/DropdownIconButton";
import AddToCollectionDropdownMenuItem from "src/resources/BlogCollections/components/AddToCollectionDropdownMenuItem";
import ArchiveBlogDropdownMenuItem from "src/resources/Blogs/components/ArchiveBlogDropdownMenuItem";

interface BlogDropdownProps {
  blog: Blog | BlogView | BlogSummary;
  extraItems?: {
    insertLocation: "top" | "bottom";
    items: ReactNode;
  };
}

function BlogDropdown({ blog, extraItems }: BlogDropdownProps) {
  const { currentUser } = useAuth();

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
        ) : null}
        {extraItems && extraItems.insertLocation === "bottom" ? extraItems.items : null}
      </DropdownMenu>
    </DropdownMenuProvider>
  );
}

export default BlogDropdown;
