import type { EmailIdent } from "@lexicon/models";

import type { Connection } from "src/database/connection";
import type { Email } from "src/database/schema";

import { and } from "drizzle-orm";

import { emailsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import maybeEq from "src/utility/databaseFilters/maybeEq";

interface SelectEmailFilters {
  id?: string;
  ident?: EmailIdent;
}

async function selectEmail(
  connection: Connection,
  { id, ident }: SelectEmailFilters,
): Promise<Email | null> {
  return await fetchSole(
    connection
      .select()
      .from(emailsTable)
      .where(and(maybeEq(emailsTable.id, id), maybeEq(emailsTable.ident, ident))),
  );
}

export default selectEmail;
