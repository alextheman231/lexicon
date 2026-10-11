import { EmailIdent } from "@lexicon/models";
import nodeCron from "node-cron";
import { getConnection } from "src/database/connection";
import loadEmails from "src/services/emails/fetchEmails";
import { compile } from "handlebars"
import { readFile } from "node:fs/promises";
import path from "node:path";

const sendEmails = nodeCron.createTask("* * * * *", async () => {
    const connection = getConnection()
    
    const emailsToSend = await loadEmails(connection, {sentAt: null, forUpdate: {skipLocked: true}})
    
    for(const email of emailsToSend){
        switch(email.ident){
            case EmailIdent.RESET_PASSWORD: {
                const template = compile(await readFile(path.join(process.cwd(), "templates", "resetPassword.html"), "utf-8"))(email.context)
                // Send email
                break
            }
        }
    }
});

export default sendEmails;
