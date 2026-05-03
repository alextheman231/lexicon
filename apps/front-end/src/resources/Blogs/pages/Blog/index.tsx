import { Page, QueryBoundary } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import Typography from "@mui/material/Typography";

import BlogContent from "src/resources/Blogs/pages/Blog/BlogContent";
import { useBlogQuery } from "src/resources/Blogs/queries";

interface BlogPageProps {
  blogId: string;
}

function Blog({ blogId }: BlogPageProps) {
  const { data: blog, isPending, error } = useBlogQuery(blogId);

  return (
    <QueryBoundary data={blog} isLoading={isPending} error={error}>
      {(blog) => {
        return (
          <Page
            title={blog.title}
            subtitle={
              blog.publishedAt ? (
                <Typography variant="subtitle2">
                  Published by {blog.authorDisplayName} (
                  <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>)
                  on {formatDateAndTime(blog.publishedAt)}`
                </Typography>
              ) : (
                <Typography variant="subtitle2">
                  Created by {blog.authorDisplayName} (
                  <InternalLink to={`/users/${blog.authorId}`}>{blog.authorUsername}</InternalLink>)
                  • Unpublished
                </Typography>
              )
            }
          >
            <BlogContent content={blog.content} />
          </Page>
        );
      }}
    </QueryBoundary>
  );
}

export default Blog;
