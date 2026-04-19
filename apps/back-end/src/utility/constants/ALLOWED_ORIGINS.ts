import { stringListToArray } from "@alextheman/utility";

const ALLOWED_ORIGINS: Array<string> = stringListToArray(process.env.ALLOWED_ORIGINS ?? "");

export default ALLOWED_ORIGINS;
