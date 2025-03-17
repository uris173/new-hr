import { parentPort } from "worker_threads";
import { EventModel } from "../../models/data/event.js";
import { UserModel } from "../../models/data/user.js";

const saveEventDoor = async (data) => {
  let doorIds = Object.keys(data);

  await Promise.all(doorIds.map(async (doorId) => {
    await Promise.all(data[doorId].map(async (event) => {
      let user = await UserModel.findOne({ employeeNoString: event.employeeNoString }, "_id");
      
    }));

  }));
};

parentPort.on("message", (data) => {

});