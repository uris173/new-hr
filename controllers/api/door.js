import { DoorModel } from "../../models/settings/door.js"
import { EventModel } from "../../models/data/event.js";

export const getDoors = async (req, res, next) => {
  try {
    let doors = await DoorModel.find({ status: "active" }, "ip login password");
    res.status(200).json(doors);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getLastDoorEvent = async (req, res, next) => {
  try {
    let doors = await DoorModel.find({ status: "active" }, "_id").lean();
    doors = await Promise.all(doors.map(async door => {
      let lastEvent = await EventModel.findOne({ door: door._id }, "-_id time employeeNoString serialNo")
      .sort({ time: -1 })
      .lean();

      return {
        ...door,
        lastEvent
      };
    }));

    res.status(200).json(doors);
  } catch(error) {
    console.error(error);
    next(error);
  }
};