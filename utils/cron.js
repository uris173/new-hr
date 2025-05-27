import { schedule } from "node-cron";
import { createCalendar } from "./helper";

export const scheduleCronOnceInMonth = () => {
  schedule("0 1 1 * *", async () => {
    try {
      console.log("Running Cron once in month at 01:00 on the first day of the month");
      await createCalendar();
    } catch (error) {
      console.error("Error in Cron once in month:", error);
    }
  });
};