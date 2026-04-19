import type { ParamsDictionary } from "express-serve-static-core";

import { DataError, parseEnv } from "@alextheman/utility";
import { parseUser } from "@lexicon/models";
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
import { insertAuthProvider, selectAuthProvider } from "src/services/auth";
import { insertUser, selectUser } from "src/services/users";
import { expireUserSession, insertUserSession, selectUserSession } from "src/services/userSessions";
import ALLOWED_ORIGINS from "src/utility/constants/ALLOWED_ORIGINS";
import handleEndpointMiddleware from "src/utility/handleEndpointMiddleware";

const authRouter = Router();
const ENV = parseEnv(process.env.NODE_ENV ?? "development");
function getCallbackUrl(originalUrl: string = "/api/v1/auth/google/callback") {
  return `${process.env.API_BASE_URL!}${originalUrl}`;
}

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
        throw new DataError({}, "INVALID_REDIRECT", "Missing redirect parameter");
      }

      if (!ALLOWED_ORIGINS.includes(redirect)) {
        throw new DataError(
          { redirect },
          "INVALID_REDIRECT",
          "The provided redirect origin is not allowed by CORS policy.",
        );
      }

      response.cookie("oauth_state", state, {
        httpOnly: true,
        sameSite: "lax",
        secure: ENV === "production",
      });
      response.cookie("oauth_pkce_verifier", codeVerifier, {
        httpOnly: true,
        sameSite: "lax",
        secure: ENV === "production",
      });

      const url = buildAuthorizationUrl(config, {
        redirect_uri: callbackUrl,
        scope: "openid email profile",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state,
      });

      response.cookie("oauth_redirect", redirect, {
        httpOnly: true,
        sameSite: "lax",
        secure: ENV === "production",
      });

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
      throw new DataError({}, "MISSING_OAUTH_DATA", "Missing OAuth cookies");
    }

    const callbackUrl = new URL(getCallbackUrl(request.originalUrl));

    if (request.query.state !== cookieState) {
      // TODO: Create a BaseError class.
      // I want the error code and error message, however given the sensitivity of the data I do not feel comfortable including it in the error data.
      // As such, we should not be providing data here, but BaseError has not been created yet so DataError with an empty payload is sufficient for now.
      throw new DataError({}, "INVALID_STATE", "The state provided is invalid.");
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
        throw new DataError({}, "INVALID_GOOGLE_RESPONSE", "Missing required Google claims");
      }
      const existingProvider = await selectAuthProvider(transaction, claims);

      if (existingProvider) {
        const user = parseUser(await selectUser(transaction, existingProvider.userId));
        const session = await insertUserSession(transaction, { userId: user.id });
        return { user, session };
      }

      const [baseUsername] = claims.email.toString().split("@");
      const username = `${baseUsername}_${randomBytes(3).toString("hex")}`;

      const user = await insertUser(transaction, {
        email: claims.email.toString(),
        username,
        displayName: claims.name?.toString() ?? username,
      });

      await insertAuthProvider(transaction, {
        userId: user.id,
        provider: "google",
        providerUserId: claims.sub,
      });

      const session = await insertUserSession(transaction, { userId: user.id });
      return { user, session };
    });

    response.cookie("session", session.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: ENV === "production",
      expires: session.expiresAt,
    });

    const redirect = request.cookies.oauth_redirect;

    if (typeof redirect !== "string") {
      throw new DataError({}, "INVALID_REDIRECT", "Missing redirect parameter");
    }

    response.clearCookie("oauth_redirect");

    if (ENV === "test") {
      return response.status(200).send({ user });
    }

    response.redirect(`${redirect}/auth/callback`);
  }),
);

authRouter.get(
  "/current-user",
  handleEndpointMiddleware(async (request, response) => {
    const connection = getConnection();
    const sessionId = request.cookies.session;

    if (!sessionId) {
      return response.status(200).send({ user: null });
    }

    const session = await selectUserSession(connection, sessionId);

    if (session === null || session.expiresAt < new Date()) {
      response.clearCookie("session");
      return response.status(200).send({ user: null });
    }

    const user = parseUser(await selectUser(connection, session.userId));
    return response.status(200).send({ user });
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
