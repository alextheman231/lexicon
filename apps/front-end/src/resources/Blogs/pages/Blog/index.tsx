import { Page, QueryBoundary } from "@alextheman/components";
import { formatDateAndTime } from "@alextheman/utility";

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
              blog.publishedAt
                ? `Published by ${blog.authorDisplayName} (${blog.authorUsername}) on ${formatDateAndTime(blog.publishedAt)}`
                : `Created by ${blog.authorDisplayName} (${blog.authorUsername}) • Unpublished`
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
