import type { UserProfileFormOutputData } from "@lexicon/models";

import { Page, useSnackbar } from "@alextheman/components";
import { useLocation } from "wouter";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundary from "src/components/QueryBoundary";
import UserProfileForm from "src/components/UserProfileForm";
import { useUpdateUserProfileMutation } from "src/resources/Users/queries";
import formatError from "src/utility/errors/formatError";

function EditUserProfile() {
  const { currentUser, currentUserLoading } = useAuth();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfileMutation();
  const [_, setLocation] = useLocation();
  const { addSnackbar } = useSnackbar();

  async function onSubmit(data: UserProfileFormOutputData) {
    try {
      await updateUserProfile(data);
      setLocation(`/users/${currentUser?.id}`);
    } catch (error) {
      addSnackbar(formatError(error), "error");
    }
  }

  return (
    <Page title="Edit Profile" disablePadding>
      <QueryBoundary isLoading={currentUserLoading} data={currentUser}>
        {(user) => {
          return <UserProfileForm user={user} onSubmit={onSubmit} />;
        }}
      </QueryBoundary>
    </Page>
  );
}

export default EditUserProfile;
