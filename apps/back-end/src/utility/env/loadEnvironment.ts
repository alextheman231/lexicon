import type { Env } from "src/utility/miscellaneous/parseEnv";

import parseEnv from "src/utility/miscellaneous/parseEnv";

function loadEnvironment(): Env {
  return parseEnv(process.env.NODE_ENV ?? "development");
}

export default loadEnvironment;
