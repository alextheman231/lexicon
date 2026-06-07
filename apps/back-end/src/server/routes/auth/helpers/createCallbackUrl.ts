function createCallbackUrl(originalUrl: string = "/api/v1/auth/google/callback") {
  return `${process.env.API_BASE_URL!}${originalUrl}`;
}

export default createCallbackUrl;
