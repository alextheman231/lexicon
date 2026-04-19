import type { RequestParamHandler } from "express";

import { parseUUID } from "@alextheman/utility";

// eslint-disable-next-line func-style
const validateUUID: RequestParamHandler = (_request, _response, next, id) => {
  try {
    parseUUID(id);
    next();
  } catch (error) {
    next(error);
  }
};

export default validateUUID;
