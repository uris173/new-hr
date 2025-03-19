import { Worker } from "worker_threads";
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

export const postDoorEvents = async (req, res, next) => {
  try {
    let body = req.body;
    const worker = new Worker('./utils/workers/door-worker.js', { workerData: body });

    worker.on("message", (data) => {
      console.log("Worker response:", data);
      res.status(200).json(data);
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
    next(error);
  }
};

export const syncDoors = async (req, res, next) => {
  try {
    let { userId, door } = req.body;

    let findDoor = await DoorModel.findById(door, "-_id ip type").lean();
    if (!findDoor) throw { status: 400, message: "doorNotFound" };

    let user = await UserModel.findByIdAndUpdate(userId, { 
      $addToSet: { sync: { ip: findDoor.ip, type: findDoor.type } }
    }, { new: true, select: "_id" });
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json({ message: "synced" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};