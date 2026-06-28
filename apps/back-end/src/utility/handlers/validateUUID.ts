import type { RequestParamHandler } from "express";

import { parseUUID } from "@alextheman/utility";
import { APIError, DataError } from "@alextheman/utility/v6";

// eslint-disable-next-line func-style -- It needs to be written this way so we can give it a type annotation.
const validateUUID: RequestParamHandler = (_request, _response, next, id) => {
  try {
    parseUUID(id);
    next();
  } catch (error) {
    if (DataError.check(error)) {
      next(new APIError(400, "INVALID_UUID", error.message, error.data));
    } else {
      next(error);
    }
  }
};

export default validateUUID;
