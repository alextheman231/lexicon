import type { Connection } from "src/database/connection";

class FactoryContext {
  public connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }
}

export default FactoryContext;
