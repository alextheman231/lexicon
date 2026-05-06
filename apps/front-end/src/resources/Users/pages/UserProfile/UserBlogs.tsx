import type { BlogSummary, User } from "@lexicon/models";

import { QueryBoundaryError } from "@alextheman/components";
import { InternalLink } from "@alextheman/components/v7";
import { formatDateAndTime } from "@alextheman/utility";
import { parseBlogSummary } from "@lexicon/models";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import QueryBoundaryDataRowsMap from "src/components/QueryBoundaryDataRowsMap";
import QueryBoundaryProvider from "src/components/QueryBoundaryProvider";
import TablePagination from "src/components/TablePagination";
import TableSortLabel from "src/components/TableSortLabel";
import usePagination from "src/hooks/usePagination";
import { useBlogsQuery } from "src/resources/Blogs/queries";

interface UserBlogsProps {
  user: User;
}

function UserBlogs({ user }: UserBlogsProps) {
  const [{ paginationSettings }, { applySort, setPageNumber, setPageSize }] =
    usePagination<BlogSummary>({
      pageNumber: 0,
      pageSize: 100,
      sortColumn: "publishedAt",
      sortDirection: "desc",
    });
  const { data, isPending, error } = useBlogsQuery({ ...paginationSettings, authorId: user.id });
  const { rows: blogs, totalRecordCount } = data ?? {};

  return (
    <QueryBoundaryProvider data={blogs} isLoading={isPending} error={error}>
      <QueryBoundaryError />
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel<BlogSummary>
                    columnName="title"
                    applySort={applySort}
                    paginationSettings={paginationSettings}
                  >
                    Title
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel<BlogSummary>
                    columnName="publishedAt"
                    applySort={applySort}
                    paginationSettings={paginationSettings}
                  >
                    Published at
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <QueryBoundaryDataRowsMap itemParser={parseBlogSummary} columns={2}>
                {(blog) => {
                  return (
                    <TableRow>
                      <TableCell>
                        <InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>
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
            <TableFooter>
              <TableRow>
                <TablePagination<BlogSummary>
                  recordCount={totalRecordCount}
                  paginationSettings={paginationSettings}
                  setPageNumber={setPageNumber}
                  setPageSize={setPageSize}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Card>
    </QueryBoundaryProvider>
  );
}

export default UserBlogs;
