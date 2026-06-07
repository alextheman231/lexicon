import type { CookieOptions } from "express-serve-static-core";

import parseEnv from "src/utility/miscellaneous/parseEnv";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

const COOKIES: CookieOptions = {
  httpOnly: true,
  sameSite: ENV === "production" ? "none" : "lax",
  secure: ENV === "production",
};

export default COOKIES;
