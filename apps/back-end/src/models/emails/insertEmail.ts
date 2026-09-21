import { assertNotNull } from "@alextheman/utility";
import { Connection } from "src/database/connection";
import { Email, EmailInsert, emailsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

async function insertEmail(connection: Connection, data: EmailInsert): Promise<Email> {
    const email = await fetchSole(connection.insert(emailsTable).values(data).returning())
    assertNotNull(email)
    return email
}

export default insertEmail
