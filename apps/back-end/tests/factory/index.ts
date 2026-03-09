import type { Connection } from "src/database/connection";

import FactoryContext from "tests/factory/context";
import UserFactory from "tests/factory/users";

class TestFactory {
  private context: FactoryContext;

  public users: UserFactory;

  public constructor(context: FactoryContext) {
    this.context = context;

    this.users = new UserFactory(this.context);
  }

  public static create(connection: Connection): TestFactory {
    const context = new FactoryContext(connection);
    return new TestFactory(context);
  }
}

export default TestFactory;
