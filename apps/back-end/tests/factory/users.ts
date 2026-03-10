import type { User, UserData } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";

import { faker } from "@faker-js/faker";

import { insertUser } from "src/services/users";

class UserFactory {
  private context: FactoryContext;

  public records: Record<string, User>;

  public constructor(context: FactoryContext) {
    this.context = context;
    this.records = {};
  }

  public async insert(data?: Partial<UserData>): Promise<User> {
    const userTemplate: UserData = {
      username: faker.internet.username(),
      displayName: faker.internet.displayName(),
      email: faker.internet.email(),
      dateOfBirth: faker.date.birthdate(),
      ...data,
    };

    const user = await insertUser(this.context.connection, userTemplate);

    this.records[user.id] = user;

    return user;
  }
}

export default UserFactory;
