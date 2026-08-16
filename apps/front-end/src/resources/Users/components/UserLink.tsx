import { InternalLink } from "@alextheman/components/routing";

interface UserLinkProps {
  userId: string;
  username: string;
  displayName: string | null;
}

function UserLink({ userId, username, displayName }: UserLinkProps) {
  if (displayName === null) {
    return <InternalLink to={`/users/${userId}`}>{username}</InternalLink>;
  }
  return (
    <>
      {displayName} (<InternalLink to={`/users/${userId}`}>{username}</InternalLink>)
    </>
  );
}

export default UserLink;
