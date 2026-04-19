import type { User, UserSession, UserSessionData } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";
import type UserFactory from "tests/factory/users";

import { insertUserSession } from "src/services/userSessions";

class AuthProviderFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<PropertyKey, UserSession>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.users = users;
    this.records = {};
  }

  public async insert(
    data?: Partial<Omit<UserSessionData, "userId"> & { user?: string | User }>,
  ): Promise<UserSession> {
    let userId: string | User | undefined = data?.user;

    // TODO: Make this binding logic its own function
    if (!userId) {
      userId = await this.users.insert();
    }
    if (typeof userId !== "string") {
      userId = userId.id;
    }

    const userSession = await insertUserSession(this.context.connection, { userId });
    this.records[userSession.id] = userSession;
    return userSession;
  }
}

export default AuthProviderFactory;
