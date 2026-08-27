import getIdsFromProfilePictureFileKey from "src/utility/fileKeys/getIdsFromProfilePictureFileKey";

interface ProfilePictureUrlParams {
  id: string;
  profilePictureFileKey: string | null;
}

function getProfilePictureUrl(user: ProfilePictureUrlParams): string | null {
  if (user.profilePictureFileKey === null) {
    return null;
  }

  const fileKeyParams = getIdsFromProfilePictureFileKey(user.profilePictureFileKey);

  if (fileKeyParams === null) {
    return null;
  }

  return `/api/v1/users/${user.id}/profile-picture/${fileKeyParams.keyId}`;
}

export default getProfilePictureUrl;
