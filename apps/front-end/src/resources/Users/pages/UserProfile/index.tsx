import { Page, useHash } from "@alextheman/components";
import { DropdownMenuItem, DropdownMenuWrapper, InternalLink } from "@alextheman/components/v7";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import QueryBoundaryWrapper from "src/components/QueryBoundary";
import AboutUser from "src/resources/Users/pages/UserProfile/AboutUser";
import UserBlogs from "src/resources/Users/pages/UserProfile/UserBlogs";
import { useUserQuery } from "src/resources/Users/queries";

interface UserProfileProps {
  userId: string;
}

type TabState = "blogs" | "about";

function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isPending, error } = useUserQuery(userId);
  const [tab, setTab] = useHash<TabState>("blogs");

  return (
    <QueryBoundaryWrapper data={user} isLoading={isPending} error={error}>
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
            tabs={
              <Tabs
                value={tab}
                onChange={(_, value: TabState) => {
                  setTab(value);
                }}
              >
                <Tab label="Blogs" value="blogs" />
                <Tab label="About" value="about" />
              </Tabs>
            }
          >
            {{ blogs: <UserBlogs user={user} />, about: <AboutUser user={user} /> }[tab]}
          </Page>
        );
      }}
    </QueryBoundaryWrapper>
  );
}

export default UserProfile;
