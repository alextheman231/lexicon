import type { Email } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import generateToken from "src/services/auth/generateToken";
import getSignUpLink from "src/services/auth/getSignUpLink";
import changeEmailSent from "src/services/emails/changeEmailSent";
import sendEmail from "src/services/emails/sendEmail";
import renderHtmlTemplate from "src/utility/template/renderHtmlTemplate";

async function sendCompleteSignUpEmail(connection: Transaction, email: Email) {
  console.info(`Sending ${email.ident} email ${email.id}`);
  const token = await generateToken(email.recipientId, "complete-sign-up");
  await changeEmailSent(connection, email.id);

  const template = await renderHtmlTemplate("completeSignUp.html", {
    ...email.context,
    signUpLink: getSignUpLink({ token }),
  });
  await sendEmail(email.recipientEmail, {
    subject: "Complete your sign-up to Lexicon",
    html: template,
  });

  console.info(`${email.ident} email ${email.id} sent`);
}

export default sendCompleteSignUpEmail;
