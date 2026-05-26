import type { BlogSummary } from "@lexicon/models";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponentsList } from "src/groups/QueryBoundary/creators/createListQueryBoundary";

import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

interface BlogsTableProps {
  PaginationGroup: PaginationComponents<BlogSummary>;
  QueryBoundary: LexiconQueryBoundaryComponentsList<BlogSummary>;
  totalRecordCount?: number;
  includeAuthor?: boolean;
}

function BlogsTable({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeAuthor,
}: BlogsTableProps) {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <PaginationGroup.TableSortLabel columnName="title">
                  Title
                </PaginationGroup.TableSortLabel>
              </TableCell>
              {includeAuthor ? <TableCell>Author</TableCell> : null}
              <TableCell>
                <PaginationGroup.TableSortLabel columnName="publishedAt">
                  Published at
                </PaginationGroup.TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <QueryBoundary.DataRowsMap columns={3}>
              {(blog) => {
                return (
                  <TableRow>
                    <TableCell>
                      <InternalLink to={`/blogs/${blog.id}`}>{blog.title}</InternalLink>
                    </TableCell>
                    {includeAuthor ? (
                      <TableCell>
                        {blog.authorDisplayName} (
                        <InternalLink to={`/users/${blog.authorId}`}>
                          {blog.authorUsername}
                        </InternalLink>
                        )
                      </TableCell>
                    ) : null}
                    <TableCell>
                      {blog.publishedAt ? formatDateAndTime(blog.publishedAt) : "Not published yet"}
                    </TableCell>
                  </TableRow>
                );
              }}
            </QueryBoundary.DataRowsMap>
          </TableBody>
          <TableFooter>
            <TableRow>
              <PaginationGroup.TablePagination recordCount={totalRecordCount} />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Card>
  );
}

export default BlogsTable;
