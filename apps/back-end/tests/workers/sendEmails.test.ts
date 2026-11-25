import { addDaysToDate, assertNotNull, isSameDate } from "@alextheman/utility";
import { describe, expect, test, vitest } from "vitest";

import TestFixtures from "tests/fixtures";

import insertEmail from "src/models/emails/insertEmail";
import selectEmail from "src/models/emails/selectEmail";
import sendEmails from "src/workers/sendEmails";

vitest.mock("src/clients/sesClient", () => {
  return {
    default: {
      send: vitest.fn(),
    },
  };
});

describe("sendEmails", () => {
  test("Sends the reset password email", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const email = await insertEmail(connection, {
      ident: "FORGOTTEN_PASSWORD",
      recipientId: user.id,
      context: { username: user.displayName ?? user.username },
      sentAt: null,
    });

    await sendEmails.execute();

    const sentEmail = await selectEmail(connection, { id: email.id });
    assertNotNull(sentEmail);

    expect(sentEmail.sentAt).not.toBeNull();
  });
  test("Sends the forgotten password email", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const user = await factory.users.insert();
    const email = await insertEmail(connection, {
      ident: "FORGOTTEN_PASSWORD",
      recipientId: user.id,
      context: { username: user.displayName ?? user.username },
      sentAt: null,
    });

    await sendEmails.execute();

    const sentEmail = await selectEmail(connection, { id: email.id });
    assertNotNull(sentEmail);

    expect(sentEmail.sentAt).not.toBeNull();
  });
  test("Does not re-send emails that have already been sent", async () => {
    const fixtures = new TestFixtures();

    const { connection } = fixtures;
    const factory = await fixtures.factory;

    const yesterday = addDaysToDate(new Date(), -1);

    const user = await factory.users.insert();
    const emailToSend = await insertEmail(connection, {
      ident: "COMPLETE_SIGN_UP",
      recipientId: user.id,
      context: { username: user.displayName ?? user.username },
      sentAt: null,
    });
    const emailNotToSend = await insertEmail(connection, {
      ident: "COMPLETE_SIGN_UP",
      recipientId: user.id,
      context: { username: user.displayName ?? user.username },
      sentAt: yesterday,
    });

    await sendEmails.execute();

    const sentEmail = await selectEmail(connection, { id: emailToSend.id });
    assertNotNull(sentEmail);

    expect(sentEmail.sentAt).not.toBeNull();

    const unaffectedEmail = await selectEmail(connection, { id: emailNotToSend.id });
    assertNotNull(unaffectedEmail);
    assertNotNull(unaffectedEmail.sentAt);

    expect(isSameDate(unaffectedEmail.sentAt, yesterday)).toBe(true);
  });
});
