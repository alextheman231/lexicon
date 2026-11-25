import { EmailIdent } from "@lexicon/models";
import { createTask } from "node-cron";

import { getConnection } from "src/database/connection";
import generatePasswordResetToken from "src/services/auth/generatePasswordResetToken";
import getSignUpLink from "src/services/auth/getSignUpLink";
import changeEmailSent from "src/services/emails/changeEmailSent";
import loadEmails from "src/services/emails/loadEmails";
import sendEmail from "src/services/emails/sendEmail";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import handleWorkerCallback from "src/utility/handlers/handleWorkerCallback";
import renderHtmlTemplate from "src/utility/template/renderHtmlTemplate";

const sendEmails = createTask(
  "* * * * *",
  handleWorkerCallback(async () => {
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
          case EmailIdent.COMPLETE_SIGN_UP: {
            console.info(`Sending ${email.ident} email ${email.id}`);
            const token = await generatePasswordResetToken(email.recipientId);
            await changeEmailSent(transaction, email.id);

            const template = await renderHtmlTemplate("completeSignUp.html", {
              ...email.context,
              signUpLink: getSignUpLink({ token }),
            });
            await sendEmail(email.recipientEmail, {
              subject: "Complete your sign-up to Lexicon",
              html: template,
            });

            console.info(`${email.ident} email ${email.id} sent`);
            break;
          }
          default: {
            throw email.ident satisfies never;
          }
        }
      });
    }
  }),
);

export default sendEmails;
