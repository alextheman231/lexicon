import { Page, useHash, useIsLargeScreen } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import { createTabGroup } from "@alextheman/components/Tab";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useAuth } from "src/AuthContextProvider";
import DropdownMenuIconButton from "src/components/DropdownIconButton";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import AboutUser from "src/resources/Users/pages/UserProfile/AboutUser";
import UserBlogCollections from "src/resources/Users/pages/UserProfile/UserBlogCollections";
import UserBlogs from "src/resources/Users/pages/UserProfile/UserBlogs";
import useUserQuery from "src/resources/Users/queries/useUserQuery";
import subtitleFormatter from "src/utility/valueFormatters/subtitleFormatter";

interface UserProfileProps {
  userId: string;
}

type TabState = "blogs" | "collections" | "about";

function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isPending, error } = useUserQuery(userId);
  const QueryBoundary = createObjectQueryBoundary({
    query: { data: user, isLoading: isPending, error },
  });

  const [tab, setTab] = useHash<TabState>("blogs");
  const Tab = createTabGroup<TabState>({ tab, setTab });

  const isLargeScreen = useIsLargeScreen();
  const { currentUser, unauthenticate } = useAuth();

  return (
    <Page
      title={
        <QueryBoundary.Data>
          {(user) => {
            return (
              <Stack spacing={2}>
                <Avatar
                  src={`/api/v1/users/${userId}/profile-picture`}
                  sx={{ width: 100, height: 100 }}
                />
                <Typography variant="h6">{user.displayName ?? user.username}</Typography>
              </Stack>
            );
          }}
        </QueryBoundary.Data>
      }
      subtitle={<QueryBoundary.Value propertyName="username" valueFormatter={subtitleFormatter} />}
      action={
        <QueryBoundary.Data>
          {(user) => {
            return (
              <DropdownMenuProvider>
                <DropdownMenuIconButton />
                <DropdownMenu>
                  <DropdownMenuItem component={InternalLink} to="/blogs/new">
                    Create Blog
                  </DropdownMenuItem>
                  <DropdownMenuItem component={InternalLink} to="/blog-collections/new">
                    Create Blog Collection
                  </DropdownMenuItem>
                  {user.id === currentUser?.id ? (
                    <DropdownMenuItem component={InternalLink} to="/account/profile-picture/upload">
                      Upload Profile Picture
                    </DropdownMenuItem>
                  ) : null}
                  {!isLargeScreen && user.id === currentUser?.id ? (
                    <DropdownMenuItem onClick={unauthenticate}>Sign out</DropdownMenuItem>
                  ) : null}
                </DropdownMenu>
              </DropdownMenuProvider>
            );
          }}
        </QueryBoundary.Data>
      }
      tabs={
        <Tab.List>
          <Tab.Item label="Blogs" value="blogs" />
          <Tab.Item label="Collections" value="collections" />
          <Tab.Item label="About" value="about" />
        </Tab.List>
      }
    >
      <QueryBoundary.Error />
      <QueryBoundary.Data>
        {(user) => {
          return (
            <>
              <Tab.Panel value="about">
                <AboutUser QueryBoundary={QueryBoundary} />
              </Tab.Panel>
              <Tab.Panel value="blogs">
                <UserBlogs user={user} />
              </Tab.Panel>
              <Tab.Panel value="collections">
                <UserBlogCollections user={user} />
              </Tab.Panel>
            </>
          );
        }}
      </QueryBoundary.Data>
    </Page>
  );
}

export default UserProfile;
