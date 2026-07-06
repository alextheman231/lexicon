import type { User, UserAuthProviderInsertData } from "@lexicon/models";
import type FactoryContext from "factory/context";
import type UserFactory from "factory/users";

import type { AuthProviderSchema } from "src/database/schema";

import { omitProperties } from "@alextheman/utility";
import { faker } from "@faker-js/faker";

import getIdFromFactoryResource from "tests/helpers/getIdFromFactoryResource";

import createUserAuthProvider from "src/services/auth/createUserAuthProvider";

interface AuthProviderRelations {
  user: string | User;
}
type AuthProviderFactoryDataBase = Omit<UserAuthProviderInsertData, "userId">;
type AuthProviderFactoryData = Partial<AuthProviderFactoryDataBase & AuthProviderRelations>;
type AuthProviderFactoryDataStrict = Partial<AuthProviderFactoryDataBase> & AuthProviderRelations;

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

    const authProvider = await createUserAuthProvider(this.context.connection, {
      provider: "google",
      providerUserId: faker.string.alpha(10),
      ...omitProperties(data ?? {}, "user"),
      userId,
    });
    this.records[authProvider.id] = authProvider;
    return authProvider;
  }
  public async insertStrict(data: AuthProviderFactoryDataStrict): Promise<AuthProviderSchema> {
    return await this.insert(data);
  }
}

export default AuthProviderFactory;
