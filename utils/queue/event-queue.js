import Queue from "bull";
import { syncing } from "../event.sync.js";

const eventQueue = new Queue("event-sync");
eventQueue.process(2, async (job) => {
  try {
    await syncing(job.data);
  } catch (error) {
    console.error("Error processing job:", error);
  }
});


export default eventQueue;