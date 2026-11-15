import APIError from "src/utility/errors/APIError";
import CodeError from "src/utility/errors/CodeError";

class InvalidCredentialsError extends CodeError {
  public constructor(options?: ErrorOptions) {
    super("INVALID_CREDENTIALS", "The email address or password is incorrect.", options);
  }

  public override toAPIError(): APIError {
    return new APIError(400, this.code, this.message);
  }
}

export default InvalidCredentialsError;
