import { Page, QueryBoundary } from "@alextheman/components";

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
          <Page title={user.displayName ?? user.username} subtitle={user.username}>
            More coming soon!
          </Page>
        );
      }}
    </QueryBoundary>
  );
}

export default UserProfile;
