import type { User } from "@lexicon/models";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
