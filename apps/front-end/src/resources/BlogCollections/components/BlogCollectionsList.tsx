import type { BlogCollectionView } from "@lexicon/models";

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

interface BlogCollectionsTableProps {
  PaginationGroup: PaginationComponents<BlogCollectionView>;
  QueryBoundary: LexiconQueryBoundaryComponentsList<BlogCollectionView>;
  totalRecordCount?: number;
  includeUser?: boolean;
}

function BlogCollectionsList({
  PaginationGroup,
  QueryBoundary,
  totalRecordCount,
  includeUser,
}: BlogCollectionsTableProps) {
  return (
    <List>
      <QueryBoundary.DataMap>
        {(blogCollection) => {
          return (
            <ListItem>
              <Card sx={{ width: "100%" }}>
                <CardHeader
                  title={
                    <InternalLink to={`/blog-collections/${blogCollection.id}`}>
                      {blogCollection.name}
                    </InternalLink>
                  }
                />
                <CardContent>
                  {includeUser ? (
                    <Typography variant="subtitle2">
                      <UserLink
                        userId={blogCollection.userId}
                        displayName={blogCollection.userDisplayName}
                        username={blogCollection.username}
                        profilePictureUrl={blogCollection.userProfilePictureUrl}
                      />
                    </Typography>
                  ) : null}
                  <Typography variant="subtitle2">
                    Item count: {blogCollection.itemCount}
                  </Typography>
                  <Typography variant="subtitle2">
                    Created at: {formatDateAndTime(blogCollection.createdAt)}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          );
        }}
      </QueryBoundary.DataMap>
      <PaginationGroup.ListPagination totalRecordCount={totalRecordCount} />
    </List>
  );
}

export default BlogCollectionsList;
