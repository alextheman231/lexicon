import type { CookieOptions } from "express-serve-static-core";

import loadEnvironment from "src/utility/env/loadEnvironment";

const ENV = loadEnvironment();

const COOKIES: CookieOptions = {
  httpOnly: true,
  sameSite: ENV === "production" ? "none" : "lax",
  secure: ENV === "production",
};

export default COOKIES;
