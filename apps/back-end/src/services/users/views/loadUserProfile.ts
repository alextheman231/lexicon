import type { UserProfile } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { SelectUserFilter } from "src/models/users/selectUser";

import { omitProperties } from "@alextheman/utility";

import selectUser from "src/models/users/selectUser";
import getProfilePictureUrl from "src/services/users/views/getProfilePictureUrl";

async function loadUserProfile(
  connection: Connection,
  filters: SelectUserFilter,
): Promise<UserProfile | null> {
  const user = await selectUser(connection, filters);

  if (user === null) {
    return null;
  }

  const profilePictureUrl = getProfilePictureUrl(user);
  return { ...omitProperties(user, ["email", "dateOfBirth"]), profilePictureUrl };
}

export default loadUserProfile;
