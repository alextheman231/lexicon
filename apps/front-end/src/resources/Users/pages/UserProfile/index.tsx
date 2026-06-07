import { Page, useHash, useIsLargeScreen } from "@alextheman/components";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuProvider,
} from "@alextheman/components/DropdownMenu";
import { InternalLink } from "@alextheman/components/routing";
import { createTabGroup } from "@alextheman/components/Tab";

import { useAuth } from "src/AuthContextProvider";
import DropdownMenuIconButton from "src/components/DropdownIconButton";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import AboutUser from "src/resources/Users/pages/UserProfile/AboutUser";
import UserBlogs from "src/resources/Users/pages/UserProfile/UserBlogs";
import useUserQuery from "src/resources/Users/queries/useUserQuery";

interface UserProfileProps {
  userId: string;
}

type TabState = "blogs" | "about";

function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isPending, error } = useUserQuery(userId);
  const [tab, setTab] = useHash<TabState>("blogs");
  const Tab = createTabGroup<TabState>({ tab, setTab });
  const isLargeScreen = useIsLargeScreen();
  const { currentUser, unauthenticate } = useAuth();

  return (
    <Tab.Context>
      <QueryBoundaryItemWrapper data={user} isLoading={isPending} error={error}>
        {(user) => {
          return (
            <Page
              title={user.displayName ?? user.username}
              subtitle={user.username}
              action={
                <DropdownMenuProvider>
                  <DropdownMenuIconButton />
                  <DropdownMenu>
                    <DropdownMenuItem component={InternalLink} to="/blogs/new">
                      Create Blog
                    </DropdownMenuItem>
                    {!isLargeScreen && user.id === currentUser?.id ? (
                      <DropdownMenuItem onClick={unauthenticate}>Sign out</DropdownMenuItem>
                    ) : null}
                  </DropdownMenu>
                </DropdownMenuProvider>
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
      </QueryBoundaryItemWrapper>
    </Tab.Context>
  );
}

export default UserProfile;
