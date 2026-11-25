import { SendEmailCommand } from "@aws-sdk/client-ses";

import emailClient from "src/sesClient";

interface SendEmailData {
  subject: string;
  html: string;
}

async function sendEmail(email: string, { subject, html }: SendEmailData): Promise<void> {
  await emailClient.send(
    new SendEmailCommand({
      Source: "noreply@lexiconblogs.com",
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
        },
      },
    }),
  );
}

export default sendEmail;
