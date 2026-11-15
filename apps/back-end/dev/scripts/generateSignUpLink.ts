import dotenv from "dotenv";

import path from "node:path";

import generatePasswordResetToken from "src/services/auth/generatePasswordResetToken";
import getSignUpLink from "src/services/auth/getSignUpLink";

(async () => {
  dotenv.config({ path: path.join(process.cwd(), ".env.development") });

  const [_, __, ___, userId] = process.argv;
  const token = await generatePasswordResetToken(userId);
  console.info(getSignUpLink({ token, baseUrl: "http://localhost:5173" }));
})();
