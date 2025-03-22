import { parentPort, workerData  } from "worker_threads";
import { EventModel } from "../../models/data/event.js";
import { UserModel } from "../../models/data/user.js";

const saveEventDoor = async (data) => {
  try {
    let eventPromises = [];

    Object.entries(data).forEach(([doorId, events]) => {
      events.forEach((event) => {
        eventPromises.push(
          (async () => {
            const user = await UserModel.findOne({ employeeNoString: event.employeeNoString }, "_id");

            if (!user) return null;

            return {
              type: event.type,
              time: event.time,
              user: user._id,
              door: doorId,
              // branch: event.branch,
              employeeNoString: event.employeeNoString,
              serialNo: event.serialNo,
              pictureURL: event.pictureURL,
            };
          })()
        );
      });
    });

    const eventDocs = (await Promise.all(eventPromises)).filter(Boolean);

    if (eventDocs.length > 0)
      await EventModel.insertMany(eventDocs);

    return "success";
  } catch (err) {
    console.error("Door-worker error:", err);
    throw err;
  }
};

if (workerData) {
  try {
    const result = await saveEventDoor(workerData);
    parentPort.postMessage(result);
  } catch (error) {
    console.log("Door-worker error:", error);
    parentPort.postMessage({ error: error.message });
  }
}