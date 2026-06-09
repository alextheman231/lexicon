import type { User } from "@lexicon/models";

import { Page } from "@alextheman/components";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import createItemQueryBoundary from "src/groups/QueryBoundary/creators/createItemQueryBoundary";
import createListQueryBoundary from "src/groups/QueryBoundary/creators/createListQueryBoundary";
import UnauthorisedPage from "src/pages/UnauthorisedPage";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";
import useBlogRevisionsQuery from "src/resources/Blogs/queries/useBlogRevisionsQuery";

interface BlogRevisionsProps {
  blogId: string;
  currentUser: User;
}

function BlogRevisions({ blogId, currentUser }: BlogRevisionsProps) {
  const { data: revisions, isPending, error } = useBlogRevisionsQuery(blogId);
  const { data: blog, isPending: isBlogPending, error: blogError } = useBlogQuery(blogId);

  const QueryBoundaryRevisions = createListQueryBoundary({
    query: { data: revisions, isLoading: isPending, error },
  });
  const QueryBoundaryBlog = createItemQueryBoundary({
    query: { data: blog, isLoading: isBlogPending, error: blogError },
  });

  return (
    <QueryBoundaryBlog.Context>
      <Page
        title={
          <QueryBoundaryBlog.Data loadingFallback={<Skeleton />}>
            {(blog) => {
              return `Revisions for "${blog.title}"`;
            }}
          </QueryBoundaryBlog.Data>
        }
      >
        <QueryBoundaryBlog.Data>
          {(blog) => {
            if (blog.authorId !== currentUser.id) {
              return <UnauthorisedPage />;
            }

            return (
              <QueryBoundaryRevisions.Context>
                <Card>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Revision Number</TableCell>
                          <TableCell>Revision Blog Title</TableCell>
                          <TableCell>Revision Message</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <QueryBoundaryRevisions.DataRowsMap columns={3}>
                          {(revision) => {
                            return (
                              <TableRow>
                                <TableCell>{revision.version}</TableCell>
                                <TableCell>{revision.title}</TableCell>
                                <TableCell>{revision.revisionMessage ?? "None"}</TableCell>
                              </TableRow>
                            );
                          }}
                        </QueryBoundaryRevisions.DataRowsMap>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </QueryBoundaryRevisions.Context>
            );
          }}
        </QueryBoundaryBlog.Data>
      </Page>
    </QueryBoundaryBlog.Context>
  );
}

export default BlogRevisions;
