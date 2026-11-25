import type { TokenPurpose } from "src/models/auth/TokenPurpose";

import { jwtVerify } from "jose";
import { JWSInvalid, JWTExpired } from "jose/errors";

import InvalidTokenError from "src/services/auth/errors/InvalidTokenError";
import TokenExpiredError from "src/services/auth/errors/TokenExpiredError";

async function verifyToken(token: string, purpose: TokenPurpose): Promise<string> {
  const secret = new TextEncoder().encode(process.env.LEXICON_SECRET_KEY);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "lexicon",
      audience: purpose,
    });

    if (payload.purpose !== purpose || !payload.sub) {
      throw new InvalidTokenError({ payload });
    }

    return payload.sub;
  } catch (error) {
    if (error instanceof JWTExpired) {
      throw new TokenExpiredError({ payload: error.payload });
    } else if (error instanceof JWSInvalid) {
      throw new InvalidTokenError({ payload: null });
    } else {
      throw error;
    }
  }
}

export default verifyToken;
