import type { Email } from "@lexicon/models";

import type { Transaction } from "src/database/connection";

import generateToken from "src/services/auth/generateToken";
import getResetPasswordLink from "src/services/auth/getResetPasswordLink";
import changeEmailSent from "src/services/emails/changeEmailSent";
import sendEmail from "src/services/emails/sendEmail";
import renderHtmlTemplate from "src/utility/template/renderHtmlTemplate";

async function sendForgottenPasswordEmail(connection: Transaction, email: Email) {
  console.info(`Sending ${email.ident} email ${email.id}`);

  const token = await generateToken(email.recipientId, "forgotten-password");
  await changeEmailSent(connection, email.id);

  const template = await renderHtmlTemplate("forgottenPassword.html", {
    ...email.context,
    resetPasswordLink: getResetPasswordLink({ token }),
  });
  await sendEmail(email.recipientEmail, {
    subject: "Reset your password",
    html: template,
  });

  console.info(`${email.ident} email ${email.id} sent`);
}

export default sendForgottenPasswordEmail;
