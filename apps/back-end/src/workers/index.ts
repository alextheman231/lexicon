import registerWorkers from "src/utility/initialisers/registerWorkers";
import deleteArchivedBlogs from "src/workers/deleteArchivedBlogs";
import sendEmails from "src/workers/sendEmails";

console.info("Starting the workers...");

registerWorkers({ deleteArchivedBlogs, sendEmails });
