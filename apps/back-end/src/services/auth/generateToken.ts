import type { TokenPurpose } from "src/models/auth/TokenPurpose";

import { SignJWT } from "jose";

async function generateToken(userId: string, purpose: TokenPurpose): Promise<string> {
  const secret = new TextEncoder().encode(process.env.LEXICON_SECRET_KEY);

  return new SignJWT({ purpose })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("lexicon")
    .setAudience(purpose)
    .sign(secret);
}

export default generateToken;
