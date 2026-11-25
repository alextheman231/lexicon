interface GetSignUpLinkArgs {
  token: string;
  baseUrl?: string;
}

function getResetPasswordLink({
  token,
  baseUrl = process.env.LEXICON_BASE_URL,
}: GetSignUpLinkArgs): string {
  return `${baseUrl}/users/reset-password?token=${token}`;
}

export default getResetPasswordLink;
