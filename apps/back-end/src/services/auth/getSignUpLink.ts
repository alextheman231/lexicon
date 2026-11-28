interface GetSignUpLinkArgs {
  token: string;
  baseUrl?: string;
}

function getSignUpLink({
  token,
  baseUrl = process.env.LEXICON_BASE_URL,
}: GetSignUpLinkArgs): string {
  return `${baseUrl}/auth/complete-sign-up?token=${token}`;
}

export default getSignUpLink;
