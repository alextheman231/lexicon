import type { CookieOptions } from "express-serve-static-core";

import loadEnvironment from "src/utility/env/loadEnvironment";

function loadCookies(): CookieOptions {
  const ENV = loadEnvironment();

  return {
    httpOnly: true,
    sameSite: ENV === "production" ? "none" : "lax",
    secure: ENV === "production",
  };
}

export default loadCookies;
