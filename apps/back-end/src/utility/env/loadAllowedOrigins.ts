import { stringListToArray } from "@alextheman/utility";

function loadAllowedOrigins(): Array<string> {
  return stringListToArray(process.env.ALLOWED_ORIGINS ?? "");
}

export default loadAllowedOrigins;
