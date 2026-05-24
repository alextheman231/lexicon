import type { CreateUserData, User } from "@lexicon/models";
import type FactoryContext from "factory/context";

import { faker } from "@faker-js/faker";
import { parseUser } from "@lexicon/models";

import { insertUser } from "src/models/users";

class UserFactory {
  private context: FactoryContext;

  public records: Record<string, User>;

  public constructor(context: FactoryContext) {
    this.context = context;
    this.records = {};
  }

  public async insert(data?: Partial<CreateUserData>): Promise<User> {
    const userTemplate: CreateUserData = {
      username: faker.internet.username(),
      displayName: faker.internet.displayName(),
      description: faker.lorem.paragraph(),
      email: faker.internet.email(),
      dateOfBirth: faker.date.birthdate(),
      ...data,
    };

    const insertedUser = await insertUser(this.context.connection, {
      ...userTemplate,
      dateOfBirth: userTemplate.dateOfBirth?.toISOString(),
    });

    const user = parseUser(insertedUser);

    this.records[user.id] = user;
    return user;
  }
}

export default UserFactory;
