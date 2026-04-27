import DataFactory from "tests/factory";

import { getConnection } from "src/database/connection";

function getTestFixtures() {
  const connection = getConnection();
  const factory = DataFactory.create(connection);

  return { connection, factory };
}

export default getTestFixtures;
