import createTestAuthenticatedClient from "tests/fixtures/authClient";
import createTestDataFactory from "tests/fixtures/factory";

async function getTestFixtures() {
  const { connection, factory } = createTestDataFactory();
  const { authenticatedClient, authenticatedUser, session } =
    await createTestAuthenticatedClient(factory);

  return { connection, factory, authenticatedClient, authenticatedUser, session };
}

export default getTestFixtures;
