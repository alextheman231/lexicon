import type { CookieOptions, ParamsDictionary } from "express-serve-static-core";

import { assertNotNull, parseEnv } from "@alextheman/utility";
import { APIError } from "@alextheman/utility/v6";
import { parseEndToEndAuthInsertData } from "@lexicon/models";
import { Router } from "express";
import {
  authorizationCodeGrant,
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";

import { randomBytes } from "node:crypto";

import { getGoogleConfig } from "src/auth/google";
import { getConnection } from "src/database/connection";
import { selectUser } from "src/models/users";
import { createAuthProvider, getGoogleAuthUser } from "src/services/auth";
import { createUser } from "src/services/users";
import { createUserSession, expireUserSession } from "src/services/userSessions";
import ALLOWED_ORIGINS from "src/utility/constants/ALLOWED_ORIGINS";
import endpointNotFoundError from "src/utility/endpointNotFoundError";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";

const authRouter = Router();
const ENV = parseEnv(process.env.NODE_ENV ?? "development");
function getCallbackUrl(originalUrl: string = "/api/v1/auth/google/callback") {
  return `${process.env.API_BASE_URL!}${originalUrl}`;
}

const COOKIES: CookieOptions = {
  httpOnly: true,
  sameSite: ENV === "production" ? "none" : "lax",
  secure: ENV === "production",
};

authRouter.get(
  "/google",
  handleEndpointMiddleware<ParamsDictionary, unknown, unknown, { redirect: string }>(
    async (request, response) => {
      const callbackUrl = getCallbackUrl();
      const config = await getGoogleConfig();

      const codeVerifier = randomPKCECodeVerifier();
      const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
      const state = randomState();

      const { redirect } = request.query;

      if (typeof redirect !== "string") {
        throw new APIError(400, "INVALID_REDIRECT", "Missing redirect parameter");
      }

      if (!ALLOWED_ORIGINS.includes(redirect)) {
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

authRouter.get(
  "/google/callback",
  handleEndpointMiddleware<
    ParamsDictionary,
    unknown,
    unknown,
    { code: string; state: string; redirect: string }
  >(async (request, response) => {
    const config = await getGoogleConfig();

    const cookieState = request.cookies.oauth_state;
    const pkceCodeVerifier = request.cookies.oauth_pkce_verifier;

    if (!pkceCodeVerifier || !cookieState) {
      throw new APIError(400, "MISSING_OAUTH_DATA", "Missing OAuth cookies");
    }

    const callbackUrl = new URL(getCallbackUrl(request.originalUrl));

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
      const existingProvider = await getGoogleAuthUser(transaction, claims);

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

      await createAuthProvider(transaction, {
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

authRouter.post(
  "/end-to-end",
  handleEndpointMiddleware(async (request, response) => {
    if (ENV !== "development") {
      throw endpointNotFoundError({ endpoint: "/api/v1/auth/end-to-end" });
    }

    const connection = getConnection();

    const session = await connection.transaction(async (transaction) => {
      const { email } = parseEndToEndAuthInsertData(request.body);

      const user = await selectUser(transaction, { email });

      if (user === null) {
        throw new APIError(
          404,
          "USER_NOT_FOUND",
          "The user could not be found in the development database. If you wish to test with the provided credentials, please add it to `dev/fixtures`.",
        );
      }

      const session = await createUserSession(transaction, { userId: user.id });

      return session;
    });

    response.cookie("session", session.id, {
      ...COOKIES,
      expires: session.expiresAt,
    });

    response.status(204).send({});
  }),
);

authRouter.post(
  "/logout",
  handleEndpointMiddleware(async (request, response) => {
    const connection = getConnection();
    const sessionId = request.cookies.session;

    if (!sessionId) {
      return response.status(204).send({});
    }

    response.clearCookie("session");
    await expireUserSession(connection, sessionId);
    response.status(204).send({});
  }),
);

export default authRouter;
