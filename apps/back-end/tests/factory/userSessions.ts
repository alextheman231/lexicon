import type { User, UserSession, UserSessionData } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";
import type UserFactory from "tests/factory/users";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import { insertUserSession } from "src/services/userSessions";

export type UserSessionFactoryData = Partial<
  Omit<UserSessionData, "userId"> & { user?: string | User }
>;

class UserSessionFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<PropertyKey, UserSession>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.users = users;
    this.records = {};
  }

  public async insert(data?: UserSessionFactoryData): Promise<UserSession> {
    const userId = await getIdFromFactoryResource<string>(data?.user, this.users);

    const userSession = await insertUserSession(this.context.connection, { userId });
    this.records[userSession.id] = userSession;
    return userSession;
  }
}

export default UserSessionFactory;
