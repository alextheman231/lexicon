import { memoizeAsync } from "@alextheman/utility";
import DataFactory from "factory";
import supertest from "supertest";

import { getConnection } from "src/database/connection";
import app from "src/server/app";

class TestFixtures {
  #authenticatedClient = memoizeAsync(async () => {
    const session = await this.authenticatedSession;
    const authenticatedClient = supertest.agent(app);
    authenticatedClient.jar.setCookie(`session=${session.id}`);

    return authenticatedClient;
  });
  #authenticatedSession = memoizeAsync(async () => {
    const factory = await this.factory;
    const user = await this.authenticatedUser;

    return await factory.userSessions.insert({ user });
  });
  #authenticatedUser = memoizeAsync(async () => {
    const factory = await this.factory;
    return await factory.users.insert();
  });
  #factory = memoizeAsync(async () => {
    return DataFactory.create(this.connection);
  });

  public get authenticatedClient() {
    return this.#authenticatedClient();
  }
  public get authenticatedSession() {
    return this.#authenticatedSession();
  }
  public get authenticatedUser() {
    return this.#authenticatedUser();
  }
  public get connection() {
    return getConnection();
  }
  public get factory() {
    return this.#factory();
  }
}

export default TestFixtures;
