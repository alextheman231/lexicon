import APIError from "src/utility/errors/APIError";
import CodeError from "src/utility/errors/CodeError";

class WeakPasswordError extends CodeError {
  public constructor(options?: ErrorOptions) {
    super("WEAK_PASSWORD", "The password provided is too weak.", options);
  }

  public override toAPIError(): APIError {
    return new APIError(400, this.code, this.message);
  }
}

export default WeakPasswordError;
