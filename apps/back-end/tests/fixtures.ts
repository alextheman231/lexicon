import TestFactory from "tests/factory";

import { getConnection } from "src/database/connection";

function getTestFixtures() {
  const connection = getConnection();
  const factory = TestFactory.create(connection);

  return { connection, factory };
}

export default getTestFixtures;
