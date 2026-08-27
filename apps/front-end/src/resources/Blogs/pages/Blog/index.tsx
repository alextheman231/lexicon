import { Page } from "@alextheman/components";
import { formatDateAndTime } from "@alextheman/utility";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "wouter";

import { useAuth } from "src/AuthContextProvider";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import BlogDropdown from "src/resources/Blogs/components/BlogDropdown";
import BlogContent from "src/resources/Blogs/pages/Blog/BlogContent";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import UserLink from "src/resources/Users/components/UserLink";

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
              <Stack spacing={1} sx={{ marginTop: 2 }}>
                <Typography variant="subtitle2">
                  <UserLink
                    userId={blog.authorId}
                    displayName={blog.authorDisplayName}
                    username={blog.authorUsername}
                    profilePictureUrl={blog.authorProfilePictureUrl}
                  />
                </Typography>
                <Typography variant="subtitle2">{formatDateAndTime(blog.publishedAt)}</Typography>
              </Stack>
            ) : (
              <Stack spacing={1} sx={{ marginTop: 2 }}>
                <Typography variant="subtitle2">
                  <UserLink
                    userId={blog.authorId}
                    displayName={blog.authorDisplayName}
                    username={blog.authorUsername}
                    profilePictureUrl={blog.authorProfilePictureUrl}
                  />
                </Typography>
                <Typography variant="subtitle2">Unpublished (saved as draft)</Typography>
              </Stack>
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
