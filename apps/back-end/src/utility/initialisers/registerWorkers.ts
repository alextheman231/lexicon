import type { ScheduledTask } from "node-cron";

function registerWorkers(tasks: Record<string, ScheduledTask>) {
  for (const task of Object.values(tasks)) {
    void task.start();
  }
}

export default registerWorkers;
