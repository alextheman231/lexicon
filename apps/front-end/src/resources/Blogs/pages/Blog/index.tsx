import { Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "wouter";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryItemWrapper";
import BlogDropdown from "src/resources/Blogs/components/BlogDropdown";
import BlogContent from "src/resources/Blogs/pages/Blog/BlogContent";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";

interface BlogPageProps {
  blogId: string;
}

function Blog({ blogId }: BlogPageProps) {
  const [searchParams] = useSearchParams();
  const revisionNumber = searchParams.get("revisionNumber") ?? undefined;
  const { data: blog, isPending, error } = useBlogQuery(blogId, { revisionNumber });
  const { currentUser } = useAuth();

  return (
    <QueryBoundaryItemWrapper data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        return (
          <Page
            title={blog.title}
            subtitle={
              blog.publishedAt ? (
                <Typography variant="subtitle2">
                  Published by {blog.authorDisplayName} (
                  <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>
                  ), {formatDateAndTime(blog.publishedAt)}
                </Typography>
              ) : (
                <Typography variant="subtitle2">
                  Created by {blog.authorDisplayName} (
                  <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>)
                  • Unpublished (saved as draft)
                </Typography>
              )
            }
            action={currentUser?.id === blog.authorId ? <BlogDropdown blog={blog} /> : null}
          >
            <BlogContent content={blog.content} />
          </Page>
        );
      }}
    </QueryBoundaryItemWrapper>
  );
}

export default Blog;
