import { hash } from "argon2";

function hashPassword(password: string) {
  return hash(password);
}

export default hashPassword;
