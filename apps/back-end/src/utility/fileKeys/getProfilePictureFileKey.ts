interface ProfilePictureFileKeyData {
  userId: string;
  keyId: string;
}

function getProfilePictureFileKey({ userId, keyId }: ProfilePictureFileKeyData): string {
  return `users/${userId}/profile-picture/${keyId}`;
}

export default getProfilePictureFileKey;
