import type { Router } from "express";
import type { ParamsDictionary } from "express-serve-static-core";

import { assertNotNull } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { authorizationCodeGrant } from "openid-client";

import { randomBytes } from "node:crypto";

import { loadGoogleConfig } from "src/auth/google";
import { getConnection } from "src/database/connection";
import selectUser from "src/models/users/selectUser";
import createCallbackUrl from "src/server/routes/auth/helpers/createCallbackUrl";
import loadCookies from "src/server/routes/auth/helpers/loadCookies";
import createUserAuthProvider from "src/services/auth/createUserAuthProvider";
import findGoogleAuthUser from "src/services/auth/findGoogleAuthUser";
import createUser from "src/services/users/mutations/transaction/createUser";
import createUserSession from "src/services/userSessions/mutations/transaction/createUserSession";
import loadEnvironment from "src/utility/env/loadEnvironment";
import handleEndpointMiddleware from "src/utility/handlers/handleEndpointMiddleware";

const ENV = loadEnvironment();

function getAuthGoogleCallback(auth: Router) {
  auth.get(
    "/google/callback",
    handleEndpointMiddleware<
      ParamsDictionary,
      unknown,
      unknown,
      { code: string; state: string; redirect: string }
    >(async (request, response) => {
      const COOKIES = loadCookies();
      const config = await loadGoogleConfig();

      const cookieState = request.cookies.oauth_state;
      const pkceCodeVerifier = request.cookies.oauth_pkce_verifier;

      if (!pkceCodeVerifier || !cookieState) {
        throw new APIError(400, "MISSING_OAUTH_DATA", "Missing OAuth cookies");
      }

      const callbackUrl = new URL(createCallbackUrl(request.originalUrl));

      if (request.query.state !== cookieState) {
        throw new APIError(400, "INVALID_STATE", "The state provided is invalid.");
      }

      const tokens = await authorizationCodeGrant(config, callbackUrl, {
        pkceCodeVerifier,
        expectedState: cookieState,
      });

      response.clearCookie("oauth_state");
      response.clearCookie("oauth_pkce_verifier");

      const connection = getConnection();

      const { user, session } = await connection.transaction(async (transaction) => {
        const claims = tokens.claims();
        if (!claims?.sub || !claims?.email) {
          throw new APIError(400, "INVALID_GOOGLE_RESPONSE", "Missing required Google claims");
        }
        const existingProvider = await findGoogleAuthUser(transaction, claims);

        if (existingProvider) {
          const user = await selectUser(transaction, existingProvider);
          assertNotNull(user);
          const session = await createUserSession(transaction, { userId: user.id });
          return { user, session };
        }

        const [baseUsername] = claims.email.toString().split("@");
        const username = `${baseUsername}_${randomBytes(3).toString("hex")}`;

        const user = await createUser(transaction, {
          email: claims.email.toString(),
          username,
          displayName: claims.name?.toString() ?? username,
        });

        await createUserAuthProvider(transaction, {
          userId: user.id,
          provider: "google",
          providerUserId: claims.sub,
        });

        const session = await createUserSession(transaction, { userId: user.id });
        return { user, session };
      });

      response.cookie("session", session.id, {
        ...COOKIES,
        expires: session.expiresAt,
      });

      const redirect = request.cookies.oauth_redirect;

      if (typeof redirect !== "string") {
        throw new APIError(400, "INVALID_REDIRECT", "Missing redirect parameter");
      }

      response.clearCookie("oauth_redirect");

      if (ENV === "test") {
        return response.status(200).send({ user });
      }

      response.redirect(`${redirect}/auth/callback`);
    }),
  );
}

export default getAuthGoogleCallback;
