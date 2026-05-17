import { DataError } from "@alextheman/utility/v6";

function isZodError(error: unknown): boolean {
  return DataError.check(error) && error.code === "ZOD_ERROR";
}

export default isZodError;
