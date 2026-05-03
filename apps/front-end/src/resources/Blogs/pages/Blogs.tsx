import { Page, QueryBoundaryError, SkeletonRow } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import { parseBlogSummary } from "@lexicon/models";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import QueryBoundaryDataMap from "src/components/QueryBoundaryDataMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";
import { useBlogsQuery } from "src/resources/Blogs/queries";

function Blogs() {
  const { data: blogs, isPending, error } = useBlogsQuery();

  return (
    <QueryBoundaryProvider data={blogs} isLoading={isPending} error={error}>
      <Page title="Welcome to Lexicon!" subtitle="Take a look at some of our blogs.">
        <QueryBoundaryError />
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Published at</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <QueryBoundaryDataMap
                  itemParser={parseBlogSummary}
                  loadingComponent={<SkeletonRow columns={3} />}
                >
                  {(blog) => {
                    return (
                      <TableRow>
                        <TableCell>
                          <InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>
                        </TableCell>
                        <TableCell>
                          {blog.authorDisplayName} ({blog.authorUsername})
                        </TableCell>
                        <TableCell>
                          {blog.publishedAt
                            ? formatDateAndTime(blog.publishedAt)
                            : "Not published yet"}
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </QueryBoundaryDataMap>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Page>
    </QueryBoundaryProvider>
  );
}

export default Blogs;
