function createCallbackUrl(originalUrl: string = "/api/v1/auth/google/callback") {
  return `${process.env.LEXICON_BASE_URL!}${originalUrl}`;
}

export default createCallbackUrl;
