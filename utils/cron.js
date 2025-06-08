import { schedule } from "node-cron";
import { createCalendar, checkDoorStatus } from "./cron/cron-func.js";

export const scheduleCron = async () => {
  schedule("0 1 1 * *", async () => {
    try {
      console.log("Running Cron once in month at 01:00 on the first day of the month");
      await createCalendar();
    } catch (error) {
      console.error("Error in Cron once in month:", error);
    }
  });

  schedule("*/10 * * * * *", async () => {
    try {
      console.log("Running Cron every 10 seconds to check door status");
      await checkDoorStatus();
    } catch (error) {
      console.error("Error in Cron every 5 seconds:", error);
    }
  });
};