import { Page, QueryBoundary } from "@alextheman/components";

import { useAuth } from "src/AuthContextProvider";
import UserProfileForm from "src/components/UserProfileForm";

function EditUserProfile() {
  const { signedInUser, signedInUserLoading } = useAuth();

  return (
    <Page title="Edit Profile">
      <QueryBoundary isLoading={signedInUserLoading} data={signedInUser}>
        {(user) => {
          // TODO: Replace onSubmit with actual logic that queries the back-end
          return <UserProfileForm user={user} onSubmit={async () => {}} />;
        }}
      </QueryBoundary>
    </Page>
  );
}

export default EditUserProfile;
