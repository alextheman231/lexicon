import type { ForgottenPasswordData } from "@lexicon/models";

import { assertNotNull, az } from "@alextheman/utility";
import { EmailIdent } from "@lexicon/models";
import { eq } from "drizzle-orm";
import { describe, expect, test } from "vitest";
import z from "zod";

import TestFixtures from "tests/fixtures";
import testClient from "tests/fixtures/testClient";

import { emailsTable } from "src/database/schema";
import fetchSole from "src/utility/databaseFilters/fetchSole";

describe("POST /api/v1/auth/forgotten-password", () => {
  test("Creates an email for a user that exists", async () => {
    const fixtures = new TestFixtures();

    const factory = await fixtures.factory;
    const { connection } = fixtures;

    const user = await factory.users.insert();

    const data: ForgottenPasswordData = {
      email: user.email,
    };

    await testClient.put("/api/v1/auth/forgotten-password").send(data).expect(200);

    const email = await fetchSole(
      connection.select().from(emailsTable).where(eq(emailsTable.recipientId, user.id)),
    );
    assertNotNull(email);
    const context = az
      .with(
        z.object({
          username: z.string(),
        }),
      )
      .parse(email.context);

    expect(email.recipientId).toBe(user.id);
    expect(email.ident).toBe(EmailIdent.FORGOTTEN_PASSWORD);
    expect(email.sentAt).toBeNull();
    expect(context.username).toBe(user.displayName ?? user.username);
  });
  test("Returns 200 if the user does not exist, to avoid leaking information about the existence of potential users", async () => {
    const data: ForgottenPasswordData = {
      email: "test@example.com",
    };

    await testClient.put("/api/v1/auth/forgotten-password").send(data).expect(200);
  });
});
