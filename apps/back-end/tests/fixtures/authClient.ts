import type DataFactory from "tests/factory";

import request from "supertest";

import app from "src/server/app";

async function createTestAuthenticatedClient(factory: DataFactory) {
  const authenticatedUser = await factory.users.insert();
  const session = await factory.userSessions.insert({ user: authenticatedUser });

  const authenticatedClient = request.agent(app);
  authenticatedClient.jar.setCookie(`session=${session.id}`);

  return { authenticatedClient, authenticatedUser, session };
}

export default createTestAuthenticatedClient;
