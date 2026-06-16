import { Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "wouter";

import { useAuth } from "src/AuthContextProvider";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
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
  const QueryBoundary = createObjectQueryBoundary({
    query: { data: blog, isLoading: isPending, error },
  });

  const { currentUser } = useAuth();

  return (
    <Page
      title={<QueryBoundary.Value propertyName="title" />}
      subtitle={
        <QueryBoundary.Data>
          {(blog) => {
            return blog.publishedAt ? (
              <Typography variant="subtitle2">
                Published by {blog.authorDisplayName} (
                <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>
                ), {formatDateAndTime(blog.publishedAt)}
              </Typography>
            ) : (
              <Typography variant="subtitle2">
                Created by {blog.authorDisplayName} (
                <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>) •
                Unpublished (saved as draft)
              </Typography>
            );
          }}
        </QueryBoundary.Data>
      }
      action={
        <QueryBoundary.Data>
          {(blog) => {
            return currentUser?.id === blog.authorId ? <BlogDropdown blog={blog} /> : null;
          }}
        </QueryBoundary.Data>
      }
    >
      <QueryBoundary.Value propertyName="content">
        {(content) => {
          return <BlogContent content={content} />;
        }}
      </QueryBoundary.Value>
    </Page>
  );
}

export default Blog;
