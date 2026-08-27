import type { User } from "@lexicon/models";

import type { User as UserSchema } from "src/database/schema";

import getIdsFromProfilePictureFileKey from "src/utility/fileKeys/getIdsFromProfilePictureFileKey";

function getProfilePictureUrl(user: UserSchema | User): string | null {
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
