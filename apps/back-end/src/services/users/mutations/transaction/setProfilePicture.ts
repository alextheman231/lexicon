import type { Transaction } from "src/database/connection";
import type { ProfilePictureData } from "src/services/users/mutations/setProfilePicture";

import setProfilePictureBase from "src/services/users/mutations/setProfilePicture";

async function setProfilePicture(
  transaction: Transaction,
  userId: string,
  data: ProfilePictureData,
) {
  return await setProfilePictureBase(transaction, userId, data);
}

export default setProfilePicture;
