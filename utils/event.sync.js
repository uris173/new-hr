import { DoorModel } from "../models/settings/door.js";
import { UserModel } from "../models/data/user.js";
import { EventModel } from "../models/data/event.js";
import { Worker } from "worker_threads";

export const syncing = async (data) => {
  try {
    console.log(__dirname, '../utils/workers/door-worker.js')
    const worker = new Worker(__dirname, '../utils/workers/door-worker.js', { workerData: data });

    worker.on("message", async (data) => {
      let events = await Promise.all(data.map(async (event) => {
        let findUser = await UserModel.findOne({ employeeNo: event.employeeNoString }, "_id");
        if (!findUser) return null;
        let findExists = await EventModel.findOne({
          time: { $gte: new Date(new Date(event.time).getTime() - 60000), $lte: new Date(new Date(event.time).getTime() + 60000) },
          door: event.door,
          user: findUser._id
        });
        if (findExists) return null;

        let findDoor = await DoorModel.findById(event.door, "-_id type").lean();
        event.user = findUser._id;
        event.action = findDoor.type;

        return event
      }));
      events = events.filter(e => e !== null);
      
      await EventModel.insertMany(events);
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        const exitError = new Error(`Worker stopped with exit code ${code}`);
        console.error(exitError);
      }
    });
  } catch (error) {
    console.error(error);
  }
};