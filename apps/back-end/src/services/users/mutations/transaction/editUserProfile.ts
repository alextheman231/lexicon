import type { UserProfileUpdateData } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import editUserProfileUnsafe from "src/services/users/mutations/editUserProfile";

async function editUserProfile(
  transaction: Transaction,
  userId: string,
  data: UserProfileUpdateData,
): ReturnType<typeof editUserProfileUnsafe> {
  return await editUserProfileUnsafe(transaction, userId, data);
}

export default editUserProfile;
