import { Page } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/routing";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import OwnershipRequired from "src/components/OwnershipRequired";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import useBlogRevisionsQuery from "src/resources/Blogs/queries/useBlogRevisionsQuery";
import DEFAULT_ERROR_MESSAGE from "src/utility/errors/DEFAULT_ERROR_MESSAGE";

interface BlogRevisionsProps {
  blogId: string;
}

function BlogRevisions({ blogId }: BlogRevisionsProps) {
  const { data: revisions, isPending, error } = useBlogRevisionsQuery(blogId);
  const { data: blog, isPending: isBlogPending, error: blogError } = useBlogQuery(blogId);

  const QueryBoundaryRevisions = createListQueryBoundary({
    query: { data: revisions, isLoading: isPending, error },
  });
  const QueryBoundaryBlog = createObjectQueryBoundary({
    query: { data: blog, isLoading: isBlogPending, error: blogError },
  });

  return (
    <Page
      title={
        <>
          <QueryBoundaryBlog.Error>{DEFAULT_ERROR_MESSAGE}</QueryBoundaryBlog.Error>
          <QueryBoundaryBlog.Value nullableFallback="Could not retrieve blog." propertyName="title">
            {(title) => {
              return `Revisions for "${title}"`;
            }}
          </QueryBoundaryBlog.Value>
        </>
      }
    >
      <QueryBoundaryBlog.Error />
      <QueryBoundaryRevisions.Error
        codeErrorMap={{
          FORBIDDEN_ACCESS: "You cannot see blog revisions for a blog you did not create.",
        }}
      />
      <QueryBoundaryBlog.Data>
        {(blog) => {
          return (
            <OwnershipRequired
              data={blog}
              ownerId={(blog) => {
                return blog.authorId;
              }}
              hideUnauthorisedPage
            >
              <Card>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Revision Number</TableCell>
                        <TableCell>Revision Blog Title</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <QueryBoundaryRevisions.DataRowsMap columns={2}>
                        {(revision) => {
                          return (
                            <TableRow>
                              <TableCell>
                                <InternalLink
                                  to={`/blogs/${blog.id}?revisionNumber=${revision.version}`}
                                >
                                  {revision.version}
                                </InternalLink>
                              </TableCell>
                              <TableCell>{revision.title}</TableCell>
                            </TableRow>
                          );
                        }}
                      </QueryBoundaryRevisions.DataRowsMap>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </OwnershipRequired>
          );
        }}
      </QueryBoundaryBlog.Data>
    </Page>
  );
}

export default BlogRevisions;
