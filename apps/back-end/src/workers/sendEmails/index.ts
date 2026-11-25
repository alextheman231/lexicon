import { EmailIdent } from "@lexicon/models";
import { createTask } from "node-cron";

import { getConnection } from "src/database/connection";
import loadEmails from "src/services/emails/loadEmails";
import fetchSole from "src/utility/databaseFilters/fetchSole";
import handleWorkerCallback from "src/utility/handlers/handleWorkerCallback";
import sendCompleteSignUpEmail from "src/workers/sendEmails/sendCompleteSignUpEmail";
import sendForgottenPasswordEmail from "src/workers/sendEmails/sendForgottenPasswordEmail";

const sendEmails = createTask(
  "* * * * *",
  handleWorkerCallback(async () => {
    const connection = getConnection();

    let emailSent: boolean = true;

    while (emailSent) {
      await connection.transaction(async (transaction) => {
        const email = await fetchSole(
          loadEmails(transaction, {
            forUpdate: { skipLocked: true },
            limit: 1,
            sentAt: null,
          }),
        );

        if (email === null) {
          emailSent = false;
          return;
        }

        switch (email.ident) {
          case EmailIdent.COMPLETE_SIGN_UP: {
            await sendCompleteSignUpEmail(transaction, email);
            break;
          }
          case EmailIdent.FORGOTTEN_PASSWORD: {
            await sendForgottenPasswordEmail(transaction, email);
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
