import { SendEmailCommand } from "@aws-sdk/client-ses";
import { EmailIdent } from "@lexicon/models";
import { compile } from "handlebars";
import nodeCron from "node-cron";

import { readFile } from "node:fs/promises";
import path from "node:path";

import { getConnection } from "src/database/connection";
import generatePasswordResetToken from "src/services/auth/generatePasswordResetToken";
import getSignUpLink from "src/services/auth/getSignUpLink";
import changeEmailSent from "src/services/emails/changeEmailSent";
import loadEmails from "src/services/emails/loadEmails";
import emailClient from "src/sesClient";
import fetchSole from "src/utility/databaseFilters/fetchSole";

const sendEmails = nodeCron.createTask("* * * * *", async () => {
  const connection = getConnection();

  let emailSent: boolean = true;

  while (emailSent) {
    await connection.transaction(async (transaction) => {
      const email = await fetchSole(
        loadEmails(transaction, {
          sentAt: null,
          forUpdate: { skipLocked: true },
          limit: 1,
        }),
      );

      if (email === null) {
        emailSent = false;
        return;
      }

      switch (email.ident) {
        case EmailIdent.RESET_PASSWORD: {
          console.info(`Sending ${email.ident} email ${email.id}`);
          const token = await generatePasswordResetToken(email.recipientId);
          await changeEmailSent(transaction, email.id);

          const template = compile(
            await readFile(path.join(process.cwd(), "templates", "resetPassword.html"), "utf-8"),
          )({ ...email.context, signUpLink: getSignUpLink({ token }) });

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
          console.info(`${email.ident} email ${email.id} sent`);
          break;
        }
        default: {
          throw email.ident satisfies never;
        }
      }
    });
  }
});

export default sendEmails;
