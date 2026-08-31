import deleteArchivedBlogs from "src/workers/deleteArchivedBlogs";

console.info("Starting the workers...");

for (const task of [deleteArchivedBlogs]) {
  task.start();
}
