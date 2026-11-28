import type { ReactNode } from "react";

import { isNonNullableObject } from "@alextheman/utility";

function combineHelperText(helperText: ReactNode, errors: Array<unknown>) {
  if (errors.length === 0) {
    return helperText;
  }
  return (
    <>
      {errors
        .map((error) => {
          if (
            isNonNullableObject(error) &&
            "message" in error &&
            typeof error.message === "string"
          ) {
            return error.message;
          } else {
            return error;
          }
        })
        .join(", ")}{" "}
      - {helperText}
    </>
  );
}

export default combineHelperText;
