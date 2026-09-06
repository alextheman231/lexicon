import type { CreateUserData, User } from "@lexicon/models";
import type FactoryContext from "factory/context";

import type { UserInsert } from "src/database/schema";

import { omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";
import { parseUser } from "@lexicon/models";

import { insertUser } from "src/models/users/insertUser";

export type UserFactoryData = Partial<UserInsert>;

class UserFactory {
  private context: FactoryContext;

  public records: Record<string, User>;

  public constructor(context: FactoryContext) {
    this.context = context;
    this.records = {};
  }

  public async insert(data: UserFactoryData = {}): Promise<User> {
    const userTemplate: CreateUserData & { id?: string | undefined } = {
      username: faker.internet.username(),
      displayName: faker.internet.displayName(),
      description: faker.lorem.paragraph(),
      email: faker.internet.email(),
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : faker.date.birthdate(),
      ...omitProperties(data, "dateOfBirth"),
    };

    const insertedUser = await insertUser(this.context.connection, {
      ...userTemplate,
      dateOfBirth: userTemplate.dateOfBirth?.toISOString(),
    });

    const user = parseUser(insertedUser);

    this.records[user.id] = user;
    return user;
  }
  public async insertStrict(data: UserFactoryData): Promise<User> {
    return await this.insert(data);
  }
}

export default UserFactory;
