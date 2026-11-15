import { SignJWT } from "jose";

async function generatePasswordResetToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(process.env.LEXICON_SECRET_KEY);

  return new SignJWT({ purpose: "password-reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("15m")
    .setIssuer("lexicon")
    .setAudience("password-reset")
    .sign(secret);
}

export default generatePasswordResetToken;
