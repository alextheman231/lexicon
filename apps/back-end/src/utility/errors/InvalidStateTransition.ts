import type { LexiconErrorCode } from "src/utility/errors/LexiconErrorCode";

import APIError from "src/utility/errors/APIError";
import DataError from "src/utility/errors/DataError";

interface InvalidStateTransitionErrorPayload {
  currentState: string;
  newState: string;
}

class InvalidStateTransitionError extends DataError<InvalidStateTransitionErrorPayload> {
  public constructor(data: InvalidStateTransitionErrorPayload, options?: ErrorOptions) {
    super(
      data,
      "INVALID_STATE_TRANSITION",
      "The provided state transition is not allowed.",
      options,
    );
  }

  public override toAPIError(): APIError<object, LexiconErrorCode> {
    return new APIError(400, this.code, this.message, this.data);
  }
}

export default InvalidStateTransitionError;
