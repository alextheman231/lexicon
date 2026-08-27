import type { BlogCollectionItemSummary } from "@lexicon/models";

import type { PaginationComponents } from "src/groups/pagination";
import type { LexiconQueryBoundaryComponentsList } from "src/groups/QueryBoundary/creators/createListQueryBoundary";

import { InternalLink } from "@alextheman/components/routing";
import { formatDateAndTime } from "@alextheman/utility";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";

import UserLink from "src/resources/Users/components/UserLink";

interface BlogCollectionItemsTableProps {
  QueryBoundaryItems: LexiconQueryBoundaryComponentsList<BlogCollectionItemSummary>;
  PaginationGroup: PaginationComponents<BlogCollectionItemSummary>;
  totalRecordCount?: number;
}

function BlogCollectionItemsList({
  QueryBoundaryItems,
  PaginationGroup,
  totalRecordCount,
}: BlogCollectionItemsTableProps) {
  return (
    <List>
      <QueryBoundaryItems.DataMap>
        {(item) => {
          return (
            <ListItem>
              <Card sx={{ width: "100%" }}>
                <CardHeader
                  title={<InternalLink to={`/blogs/${item.blogId}`}>{item.blogTitle}</InternalLink>}
                />
                <CardContent>
                  <Typography variant="subtitle2">
                    By:{" "}
                    <UserLink
                      userId={item.authorId}
                      username={item.authorUsername}
                      displayName={item.authorDisplayName}
                      profilePictureUrl={item.authorProfilePictureUrl}
                    />
                  </Typography>
                  <Typography variant="subtitle2">
                    Published at:{" "}
                    {item.blogPublishedAt
                      ? formatDateAndTime(item.blogPublishedAt)
                      : "Not published yet"}
                  </Typography>
                  <Typography variant="subtitle2">
                    Added: {formatDateAndTime(item.createdAt)}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          );
        }}
      </QueryBoundaryItems.DataMap>
      <PaginationGroup.ListPagination totalRecordCount={totalRecordCount} />
    </List>
  );
}

export default BlogCollectionItemsList;
