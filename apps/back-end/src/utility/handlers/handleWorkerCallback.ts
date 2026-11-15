import type { TaskFn } from "node-cron";

import { captureException } from "@sentry/node";

function handleWorkerCallback(callback: TaskFn): TaskFn {
  return async (context) => {
    try {
      await callback(context);
    } catch (error) {
      captureException(error);
      throw error;
    }
  };
}

export default handleWorkerCallback;
