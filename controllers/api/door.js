import { DoorModel } from "../../models/settings/door.js"
import { EventModel } from "../../models/data/event.js";
import { UserModel } from "../../models/data/user.js";

export const getDoors = async (req, res, next) => {
  try {
    const { _id } = req.user;
    let user = await UserModel.findById(_id, "doors").lean();
    let filter = {
      status: "active",
      ...(user.doors && user.doors.length > 0 && { _id: { $in: user.doors } })
    }

    let doors = await DoorModel.find(filter, "ip login password");
    res.status(200).json(doors);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getLastDoorEvent = async (req, res, next) => {
  try {
    let filter = {
      status: "active",
      ...(user.doors && user.doors.length > 0 && { _id: { $in: user.doors } })
    }

    let doors = await DoorModel.find(filter, "ip login password").lean();
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

export const getDoorEvents = async (req, res, next) => {
  try {
    let { doors } = req.body;
    
  } catch (error) {
    console.error(error);
    next(error);
  }
};