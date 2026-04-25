import type { UserProfileFormOutputData } from "@lexicon/models";

import { Page, QueryBoundary } from "@alextheman/components";
import { useLocation } from "wouter";

import { useAuth } from "src/AuthContextProvider";
import UserProfileForm from "src/components/UserProfileForm";
import { useUpdateUserProfileMutation } from "src/resources/Users/queries";

function EditUserProfile() {
  const { signedInUser, signedInUserLoading } = useAuth();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfileMutation();
  const [_, setLocation] = useLocation();

  async function onSubmit(data: UserProfileFormOutputData) {
    await updateUserProfile(data);
    setLocation(`/users/${signedInUser?.id}`);
    // TODO: Implement error handling pattern
  }

  return (
    <Page title="Edit Profile">
      <QueryBoundary isLoading={signedInUserLoading} data={signedInUser}>
        {(user) => {
          return <UserProfileForm user={user} onSubmit={onSubmit} />;
        }}
      </QueryBoundary>
    </Page>
  );
}

export default EditUserProfile;
