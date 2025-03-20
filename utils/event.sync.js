import { Worker } from "worker_threads";

export const syncing = async (data) => {
  try {
    const worker = new Worker('./utils/workers/door-worker.js', { workerData: data });

    worker.on("message", (data) => {
      console.log("Worker response:", data);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      next(error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        const exitError = new Error(`Worker stopped with exit code ${code}`);
        console.error(exitError);
        next(exitError);
      }
    });
  } catch (error) {
    console.error(error);
  }
}