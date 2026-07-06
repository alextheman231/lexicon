import type { CreateUserSessionData, User, UserSession } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import { omitProperties } from "@alextheman/utility";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import createUserSession from "src/services/userSessions/mutations/createUserSession";

interface UserSessionRelations {
  user: string | User;
}
type UserSessionFactoryDataBase = Omit<CreateUserSessionData, "userId">;
type UserSessionFactoryData = Partial<UserSessionFactoryDataBase & UserSessionRelations>;
type UserSessionFactoryDataStrict = Partial<UserSessionFactoryDataBase> & UserSessionRelations;

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

    const userSession = await createUserSession(this.context.connection, {
      userId,
      ...omitProperties(data ?? {}, "user"),
    });
    this.records[userSession.id] = userSession;
    return userSession;
  }
  public async insertStrict(data: UserSessionFactoryDataStrict): Promise<UserSession> {
    return await this.insert(data);
  }
}

export default UserSessionFactory;
