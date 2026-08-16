import type { BlogCollectionView } from "@lexicon/models";

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

import UserLink from "src/resources/Users/components/UserLink";

interface BlogCollectionsTableProps {
  PaginationGroup: PaginationComponents<BlogCollectionView>;
  QueryBoundary: LexiconQueryBoundaryComponentsList<BlogCollectionView>;
  totalRecordCount?: number;
  includeUser?: boolean;
}

function BlogCollectionsTable({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeUser,
}: BlogCollectionsTableProps) {
  return (
    <Card>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              {includeUser ? <TableCell>User</TableCell> : null}
              <TableCell>
                <PaginationGroup.TableSortLabel columnName="createdAt">
                  Created At
                </PaginationGroup.TableSortLabel>
              </TableCell>
              <TableCell>Item Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <QueryBoundary.DataRowsMap columns={includeUser ? 4 : 3}>
              {(blogCollection) => {
                return (
                  <TableRow>
                    <TableCell>
                      <InternalLink to={`/blog-collections/${blogCollection.id}`}>
                        {blogCollection.name}
                      </InternalLink>
                    </TableCell>
                    {includeUser ? (
                      <TableCell>
                        <UserLink
                          userId={blogCollection.userId}
                          displayName={blogCollection.userDisplayName}
                          username={blogCollection.username}
                        />
                      </TableCell>
                    ) : null}
                    <TableCell>{formatDateAndTime(blogCollection.createdAt)}</TableCell>
                    <TableCell>{blogCollection.itemCount}</TableCell>
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

export default BlogCollectionsTable;
