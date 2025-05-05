import { UserModel } from "../models/data/user.js";
import { EventModel } from "../models/data/event.js";
import { Worker } from "worker_threads";

export const syncing = async (data) => {
  try {
    const worker = new Worker('./utils/workers/door-worker.js', { workerData: data });

    worker.on("message", async (data) => {
      let events = await Promise.all(data.map(async (event) => {
        let findUser = await UserModel.findOne({ employeeNo: event.employeeNoString }, "_id");
        if (!findUser) return null;
        let findExists = await EventModel.findOne({ time: event.time, door: event.door, serialNo: event.serialNo, user: findUser._id });
        if (findExists) return null;

        event.user = findUser._id;

        return event
      }));
      events = events.filter(e => e !== null);
      
      await EventModel.insertMany(events);
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
};