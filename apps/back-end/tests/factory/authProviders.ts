import type { AuthProviderSchema, AuthProviderSchemaData, User } from "@lexicon/models";

import type FactoryContext from "tests/factory/context";
import type UserFactory from "tests/factory/users";

import { omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import { insertAuthProvider } from "src/services/auth";

export type AuthProviderFactoryData = Partial<
  Omit<AuthProviderSchemaData, "userId"> & { user?: string | User }
>;

class AuthProviderFactory {
  private context: FactoryContext;
  private users: UserFactory;

  public records: Record<PropertyKey, AuthProviderSchema>;

  public constructor(context: FactoryContext, users: UserFactory) {
    this.context = context;
    this.users = users;
    this.records = {};
  }

  public async insert(data?: AuthProviderFactoryData): Promise<AuthProviderSchema> {
    const userId = await getIdFromFactoryResource<string>(data?.user, this.users);

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
