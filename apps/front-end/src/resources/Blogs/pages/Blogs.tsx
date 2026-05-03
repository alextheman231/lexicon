import { Page, QueryBoundaryError } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import { parseBlogSummary } from "@lexicon/models";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";
import { useBlogsQuery } from "src/resources/Blogs/queries";

function Blogs() {
  const { data: blogs, isPending, error } = useBlogsQuery();

  return (
    <QueryBoundaryProvider data={blogs} isLoading={isPending} error={error}>
      <Page title="Welcome to Lexicon!" subtitle="Take a look at some of our blogs.">
        <Stack spacing={1}>
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
                  <QueryBoundaryDataRowsMap itemParser={parseBlogSummary} columns={3}>
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
                  </QueryBoundaryDataRowsMap>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Stack>
      </Page>
    </QueryBoundaryProvider>
  );
}

export default Blogs;
