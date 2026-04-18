import type { AuthProviderSchema, AuthProviderSchemaData, User } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";
import type UserFactory from "tests/factory/users";

import { omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";

import { insertAuthProvider } from "src/services/auth";

class AuthProviderFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<PropertyKey, AuthProviderSchema>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.users = users;
    this.records = {};
  }

  public async insert(
    data?: Partial<Omit<AuthProviderSchemaData, "userId"> & { user?: string | User }>,
  ): Promise<AuthProviderSchema> {
    let userId: string | User | undefined = data?.user;

    // TODO: Make this binding logic its own function
    if (!userId) {
      userId = await this.users.insert();
    }
    if (typeof userId !== "string") {
      userId = userId.id;
    }

    const authProvider = await insertAuthProvider(this.context.connection, {
      provider: "google",
      providerUserId: faker.string.alpha(10),
      ...omitProperties(data ?? {}, "user"),
      userId,
    });
    this.records[authProvider.id] = authProvider;
    return authProvider;
  }
}

export default AuthProviderFactory;
