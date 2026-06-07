import type { UserProfileFormOutputData } from "@lexicon/models";

import { Page } from "@alextheman/components";
import { useSnackbarContext } from "@alextheman/components/snackbar";

import { useAuth } from "src/AuthContextProvider";
import QueryBoundaryItemWrapper from "src/groups/QueryBoundary/QueryBoundaryWrapper";
import useLocation from "src/hooks/useLocation";
import UserProfileForm from "src/resources/Users/components/UserProfileForm";
import useUpdateUserProfileMutation from "src/resources/Users/queries/useUpdateUserProfileMutation";
import formatError from "src/utility/errors/formatError";

function EditUserProfile() {
  const { currentUser, currentUserLoading, currentUserError } = useAuth();
  const { mutateAsync: updateUserProfile } = useUpdateUserProfileMutation();
  const [_, setLocation] = useLocation();
  const { addSnackbar } = useSnackbarContext();

  async function onSubmit(data: UserProfileFormOutputData) {
    try {
      await updateUserProfile(data);
      setLocation(`/users/${currentUser?.id}`);
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page title="Edit Profile" disablePadding>
      <QueryBoundaryItemWrapper
        isLoading={currentUserLoading}
        data={currentUser}
        error={currentUserError}
      >
        {(user) => {
          return <UserProfileForm user={user} onSubmit={onSubmit} back={`/users/${user.id}`} />;
        }}
      </QueryBoundaryItemWrapper>
    </Page>
  );
}

export default EditUserProfile;
