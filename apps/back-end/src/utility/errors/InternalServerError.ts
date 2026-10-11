import APIError from "src/utility/errors/APIError";

class InternalServerError extends APIError<never, "INTERNAL_SERVER_ERROR"> {
  public constructor(message?: string, options?: ErrorOptions) {
    super(
      500,
      "INTERNAL_SERVER_ERROR",
      message ?? "An internal error has occurred.",
      undefined,
      options,
    );
  }
}

export default InternalServerError;
