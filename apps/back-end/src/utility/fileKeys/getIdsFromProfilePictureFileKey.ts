import { UUID_REGEX_PATTERN } from "@alextheman/utility";

interface ProfilePictureKeyIds {
  userId: string;
  keyId: string;
}

function getIdsFromProfilePictureFileKey(fileKey: string): ProfilePictureKeyIds | null {
  const matches = fileKey.match(
    RegExp(
      `^users/(?<userId>${UUID_REGEX_PATTERN})/profile-picture/(?<keyId>${UUID_REGEX_PATTERN})$`,
    ),
  );

  if (
    matches === null ||
    matches.groups?.userId === undefined ||
    matches.groups?.keyId === undefined
  ) {
    return null;
  }

  return {
    userId: matches.groups.userId,
    keyId: matches.groups.keyId,
  };
}

export default getIdsFromProfilePictureFileKey;
