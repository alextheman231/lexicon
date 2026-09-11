import type { Transaction } from "src/database/connection";

class FactoryContext {
  public connection: Transaction;

  public constructor(connection: Transaction) {
    this.connection = connection;
  }
}

export default FactoryContext;
