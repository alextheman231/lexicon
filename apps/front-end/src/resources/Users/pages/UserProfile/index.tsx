import { Page, useHash, useScreenSize } from "@alextheman/components";
import { DropdownMenuItem, DropdownMenuWrapper, InternalLink } from "@alextheman/components/v7";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import createTabGroup from "src/groups/Tab";
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
  const Tab = createTabGroup<TabState>({ tab, setTab });
  const { isLargeScreen } = useScreenSize();
  const { currentUser, unauthenticate } = useAuth();

  return (
    <Tab.Context>
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
                  {!isLargeScreen && user.id === currentUser?.id ? (
                    <DropdownMenuItem onClick={unauthenticate}>Sign out</DropdownMenuItem>
                  ) : null}
                </DropdownMenuWrapper>
              }
              tabs={
                <Tab.List>
                  <Tab.Item label="Blogs" value="blogs" />
                  <Tab.Item label="About" value="about" />
                </Tab.List>
              }
            >
              <Tab.Panel value="about">
                <AboutUser user={user} />
              </Tab.Panel>
              <Tab.Panel value="blogs">
                <UserBlogs user={user} />
              </Tab.Panel>
            </Page>
          );
        }}
      </QueryBoundaryWrapper>
    </Tab.Context>
  );
}

export default UserProfile;
