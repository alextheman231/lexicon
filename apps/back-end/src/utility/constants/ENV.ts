import { parseEnv } from "@alextheman/utility";

const ENV = parseEnv(process.env.NODE_ENV ?? "development");

export default ENV;
