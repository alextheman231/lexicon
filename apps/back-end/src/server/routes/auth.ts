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
import { insertUserSession } from "src/services/userSessions";
import handleMiddleware from "src/utility/handleMiddleware";

const authRouter = Router();
const ENV = parseEnv(process.env.NODE_ENV ?? "development");
function getCallbackUrl() {
  return `${process.env.API_BASE_URL!}/api/v1/auth/google/callback`;
}

authRouter.get(
  "/google",
  handleMiddleware(async (_request, response) => {
    const callbackUrl = getCallbackUrl();
    const config = await getGoogleConfig();

    const codeVerifier = randomPKCECodeVerifier();
    const codeChallenge = await calculatePKCECodeChallenge(codeVerifier);
    const state = randomState();

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

    response.redirect(url.toString());
  }),
);

authRouter.get(
  "/google/callback",
  handleMiddleware<ParamsDictionary, unknown, unknown, { code: string; state: string }>(
    async (request, response) => {
      const config = await getGoogleConfig();

      const cookieState = request.cookies.oauth_state;
      const pkceCodeVerifier = request.cookies.oauth_pkce_verifier;

      if (!pkceCodeVerifier || !cookieState) {
        throw new DataError({}, "MISSING_OAUTH_DATA", "Missing OAuth cookies");
      }

      const callbackUrl = new URL(getCallbackUrl());

      if (request.query.state !== cookieState) {
        // TODO: Create a BaseError class.
        // I want the error code and error message, however given the sensitivity of the data I do not feel comfortable including it in the error data.
        // As such, we should not be providing data here, but BaseError has not been created yet so DataError with an empty payload is sufficient for now.
        throw new DataError({}, "INVALID_STATE", "The state provided is invalid.");
      }

      callbackUrl.searchParams.set("code", request.query.code);
      callbackUrl.searchParams.set("state", request.query.state);

      const tokens = await authorizationCodeGrant(config, callbackUrl, {
        pkceCodeVerifier,
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
        const username = `${baseUsername}_${randomBytes(6).toString("hex")}`;

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
      response.status(200).send({ user });
    },
  ),
);

export default authRouter;
