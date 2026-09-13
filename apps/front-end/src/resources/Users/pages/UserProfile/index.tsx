import { Page, useHash } from "@alextheman/components";
import { createTabGroup } from "@alextheman/components/Tab";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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

  return (
    <Page
      title={
        <QueryBoundary.Data>
          {(user) => {
            return (
              <Stack spacing={2}>
                <Avatar src={user.profilePictureUrl ?? ""} sx={{ width: 100, height: 100 }} />
                <Typography variant="h6">{user.displayName ?? user.username}</Typography>
              </Stack>
            );
          }}
        </QueryBoundary.Data>
      }
      subtitle={<QueryBoundary.Value propertyName="username" valueFormatter={subtitleFormatter} />}
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
