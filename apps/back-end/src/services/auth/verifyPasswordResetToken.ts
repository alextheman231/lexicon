import { jwtVerify } from "jose";
import { JWSInvalid, JWTExpired } from "jose/errors";

import InvalidTokenError from "src/services/auth/errors/InvalidTokenError";
import TokenExpiredError from "src/services/auth/errors/TokenExpiredError";

async function verifyPasswordResetToken(token: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.LEXICON_SECRET_KEY);

  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "lexicon",
      audience: "password-reset",
    });

    if (payload.purpose !== "password-reset" || !payload.sub) {
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

export default verifyPasswordResetToken;
