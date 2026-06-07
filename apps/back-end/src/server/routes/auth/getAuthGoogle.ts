import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { stringListToArray } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";

import { loadGoogleConfig } from "src/auth/google";
import COOKIES from "src/server/routes/auth/helpers/COOKIES";
import createCallbackUrl from "src/server/routes/auth/helpers/createCallbackUrl";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

function getAuthGoogle(auth: Router) {
  auth.get(
    "/google",
    handleEndpointMiddleware<ParamsDictionary, unknown, unknown, { redirect: string }>(
      async (request, response) => {
        const callbackUrl = createCallbackUrl();
        const config = await loadGoogleConfig();

        const codeVerifier = randomPKCECodeVerifier();
        const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
        const state = randomState();

        const { redirect } = request.query;

        if (typeof redirect !== "string") {
          throw new APIError(400, "INVALID_REDIRECT", "Missing redirect parameter");
        }

        if (!stringListToArray(process.env.ALLOWED_ORIGINS ?? "").includes(redirect)) {
          throw new APIError(
            403,
            "DISALLOWED_ORIGIN",
            "The provided redirect origin is not allowed.",
            { origin: redirect },
          );
        }

        response.cookie("oauth_state", state, COOKIES);
        response.cookie("oauth_pkce_verifier", codeVerifier, COOKIES);

        const url = buildAuthorizationUrl(config, {
          redirect_uri: callbackUrl,
          scope: "openid email profile",
          code_challenge: codeChallenge,
          code_challenge_method: "S256",
          state,
        });

        response.cookie("oauth_redirect", redirect, COOKIES);

        response.redirect(url.toString());
      },
    ),
  );
}

export default getAuthGoogle;
