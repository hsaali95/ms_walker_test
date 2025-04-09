// "use server";
// // import Users from "@/db/models/user";
// import cron from "node-cron";
// import { successResponse } from "./response.decorator";

// // Run this task every 4 seconds
// cron.schedule("*/4 * * * * *", async () => {
// // cron.schedule("0 0 */12 * * *", async () => {
//   try {
//     console.log("Running job every 4 seconds...");

//     console.log("Job completed successfully!");
//     successResponse({}, "Job ran successfully every 4 seconds!");
//   } catch (error) {
//     console.error("Error running the job:", error);
//   }
// });

"use server";
import cron from "node-cron";
import axios from "axios";
import { successResponse } from "./response.decorator";

let cronTask: cron.ScheduledTask | null = null;

// Start the cron job
const startCronJob = () => {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
  }

  cronTask = cron.schedule("*/4 * * * * *", async () => {
    try {
      console.log("Running job every 4 seconds...");

      // Example API request (replace with your logic)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/example`
      );

      console.log("Job completed successfully:", response.data);
      successResponse({}, "Job ran successfully every 4 seconds!");
    } catch (error: any) {
      console.error("Error running the job:", error.message);
    }
  });
};

// Stop the cron job
const stopCronJob = () => {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
  } else {
    console.log("No cron job to stop.");
  }
};

// Handle server shutdown gracefully
process.on("SIGINT", () => {
  console.log("Server is shutting down...");
  stopCronJob();
  process.exit();
});

process.on("SIGTERM", () => {
  console.log("Server is shutting down...");
  stopCronJob();
  process.exit();
});

// Export the start and stop functions
export { startCronJob, stopCronJob };
