import handleErrorMiddleware from "src/utility/handlers/handleErrorMiddleware";

const handleClearCookies = handleErrorMiddleware((error, _request, response, next) => {
  response.clearCookie("oauth_redirect");
  response.clearCookie("oauth_state");
  response.clearCookie("oauth_pkce_verifier");
  next(error);
});

export default handleClearCookies;
