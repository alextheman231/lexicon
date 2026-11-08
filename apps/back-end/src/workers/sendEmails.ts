import { SendEmailCommand } from "@aws-sdk/client-ses";
import { EmailIdent } from "@lexicon/models";
import { compile } from "handlebars";
import nodeCron from "node-cron";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { getConnection } from "src/database/connection";
import changeEmailSent from "src/services/emails/changeEmailSent";
import loadEmails from "src/services/emails/loadEmails";
import emailClient from "src/sesClient";

const sendEmails = nodeCron.createTask("* * * * *", async () => {
  const connection = getConnection();

  const emailsToSend = await loadEmails(connection, {
    sentAt: null,
    forUpdate: { skipLocked: true },
  });

  for (const email of emailsToSend) {
    switch (email.ident) {
      case EmailIdent.RESET_PASSWORD: {
        await connection.transaction(async (transaction) => {
          await changeEmailSent(transaction, email.id);
          const template = compile(
            await readFile(path.join(process.cwd(), "templates", "resetPassword.html"), "utf-8"),
          )(email.context);
          await emailClient.send(
            new SendEmailCommand({
              Source: "noreply@lexiconblogs.com",
              Destination: {
                ToAddresses: [email.recipientEmail],
              },
              Message: {
                Subject: {
                  Data: "Reset Your Password",
                  Charset: "UTF-8",
                },
                Body: {
                  Html: {
                    Data: template,
                    Charset: "UTF-8",
                  },
                },
              },
            }),
          );
        });
        break;
      }
      default: {
        throw email.ident satisfies never;
      }
    }
  }
});

export default sendEmails;
