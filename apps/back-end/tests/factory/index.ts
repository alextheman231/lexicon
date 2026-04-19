import type { Connection } from "src/database/connection";

import AuthProviderFactory from "tests/factory/authProviders";
import FactoryContext from "tests/factory/context";
import UserFactory from "tests/factory/users";
import UserSessionFactory from "tests/factory/userSessions";

class TestFactory {
  private context: FactoryContext;

  public authProviders: AuthProviderFactory;
  public users: UserFactory;
  public userSessions: UserSessionFactory;

  public constructor(context: FactoryContext) {
    this.context = context;

    this.users = new UserFactory(this.context);
    this.authProviders = new AuthProviderFactory(this.context, this.users);
    this.userSessions = new UserSessionFactory(this.context, this.users);
  }

  public static create(connection: Connection): TestFactory {
    const context = new FactoryContext(connection);
    return new TestFactory(context);
  }
}

export default TestFactory;
