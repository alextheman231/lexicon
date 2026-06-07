import type { CookieOptions } from "express-serve-static-core";

import ENV from "src/utility/constants/ENV";

const COOKIES: CookieOptions = {
  httpOnly: true,
  sameSite: ENV === "production" ? "none" : "lax",
  secure: ENV === "production",
};

export default COOKIES;
