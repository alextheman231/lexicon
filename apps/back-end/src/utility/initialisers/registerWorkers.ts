import type { ScheduledTask } from "node-cron";

function registerWorkers(tasks: Record<string, ScheduledTask>) {
  for (const task of Object.values(tasks)) {
    task.start();
  }
}

export default registerWorkers;
