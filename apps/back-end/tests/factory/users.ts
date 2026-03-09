import type { User } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";

class UserFactory {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: TODO: Implement
  private context: FactoryContext;

  public records: Record<string, User>;

  public constructor(context: FactoryContext) {
    this.context = context;
    this.records = {};
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: TODO: Implement
  public async insert(): Promise<User> {
    // Implementation here
  }
}

export default UserFactory;
