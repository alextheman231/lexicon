import type { User } from "@lexicon/models";

import type { User as UserSchema } from "src/database/schema";

function getProfilePictureUrl(user: UserSchema | User): string | null {
  if (user.profilePictureFileKey === null) {
    return null;
  }

  return `/api/v1/users/${user.id}/profile-picture`;
}

export default getProfilePictureUrl;
