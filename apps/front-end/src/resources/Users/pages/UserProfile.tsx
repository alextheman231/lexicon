import { Page } from "@alextheman/components";
import { DropdownMenuItem, DropdownMenuWrapper, InternalLink } from "@alextheman/components/v7";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

import QueryBoundary from "src/components/QueryBoundary";
import { useUserQuery } from "src/resources/Users/queries";

interface UserProfileProps {
  userId: string;
}

function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isPending, error } = useUserQuery(userId);

  return (
    <QueryBoundary data={user} isLoading={isPending} error={error}>
      {(user) => {
        return (
          <Page
            title={user.displayName ?? user.username}
            subtitle={user.username}
            action={
              <DropdownMenuWrapper>
                <DropdownMenuItem component={InternalLink} to="/blogs/new">
                  Create Blog
                </DropdownMenuItem>
              </DropdownMenuWrapper>
            }
          >
            <Card>
              <CardHeader title="Description" />
              <Divider />
              <CardContent>{user.description}</CardContent>
            </Card>
          </Page>
        );
      }}
    </QueryBoundary>
  );
}

export default UserProfile;
