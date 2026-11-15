import registerWorkers from "src/utility/initialisers/registerWorkers";
import deleteArchivedBlogs from "src/workers/deleteArchivedBlogs";

console.info("Starting the workers...");

registerWorkers({ deleteArchivedBlogs });
