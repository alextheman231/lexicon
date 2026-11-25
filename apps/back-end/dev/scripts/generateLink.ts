import { az } from "@alextheman/utility";
import dotenv from "dotenv";
import z from "zod";

import path from "node:path";

import { TokenPurpose } from "src/models/auth/TokenPurpose";
import generateToken from "src/services/auth/generateToken";
import getResetPasswordLink from "src/services/auth/getResetPasswordLink";
import getSignUpLink from "src/services/auth/getSignUpLink";

void (async () => {
  dotenv.config({ path: path.join(process.cwd(), ".env.development") });

  const [_, __, ___, userId, rawPurpose] = process.argv;

  const purpose = az.with(z.enum(TokenPurpose).default("complete-sign-up")).parse(rawPurpose);

  const token = await generateToken(userId, purpose);

  const baseUrl = "http://localhost:5173";

  switch (purpose) {
    case "complete-sign-up": {
      console.info(getSignUpLink({ token, baseUrl }));
      break;
    }
    case "forgotten-password": {
      console.info(getResetPasswordLink({ token, baseUrl }));
      break;
    }
    default: {
      throw purpose satisfies never;
    }
  }
})();
