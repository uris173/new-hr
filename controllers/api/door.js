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
      doorStatus: "online",
      isOpen: true,
      ...(user.doors && user.doors.length > 0 && { _id: { $in: user.doors } })
    }

    let doors = await DoorModel.find(filter, "ip port login password");
    res.status(200).json(doors);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOpenDoors = async (req, res, next) => {
  try {
    let doors = await DoorModel.find({ doorStatus: "online", isOpen: true, status: "active" }, "ip port login password");
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
      doorStatus: "online",
      isOpen: true,
      ...(user.doors && user.doors.length > 0 && { _id: { $in: user.doors } })
    }

    let doors = await DoorModel.find(filter, "ip port login password").lean();
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

const getUsersNotSynced = async (doorIds) => {
  let doors = []
  let users = await Promise.all(doorIds.map(async door => {
    let obj = { };
    let findDoor = await DoorModel.findById(door, "_id ip port login password").lean();
    if (!obj[door]) {
      obj[door] = [];
    }

    let users = await UserModel.findById({
      "sync.ip": { $ne: findDoor.ip },
      "sync.port": { $ne: findDoor.port },
      status: "active",
      role: { $ne: "admin" }
    }, "fullName faceUrl employeeNo gender").lean();

    obj[door] = users;
    doors.push(findDoor);

    return obj;
  }));

  return { doors, users }
};

export const getNotSyncedUsers = async (req, res, next) => {
  try {
    let { _id } = req.user;
    let findSecurity = await UserModel.findById(_id, "-_id doors");

    let { users, dooors } = await getUsersNotSynced(findSecurity.doors);

    // let doors = [];
    // let users = await Promise.all(findSecurity.doors.map(async door => {
    //   let obj = {};
    //   let findDoor = await DoorModel.findById(door, "_id ip login password").lean();
    //   if (!obj[door]) {
    //     obj[door] = [];
    //   }
    //
    //   let users = await UserModel.find({
    //     "sync.ip": { $ne: findDoor.ip },
    //     status: "active",
    //     role: { $ne: "admin" }
    //   }, "fullName faceUrl employeeNo gender").lean();
    //
    //   obj[door] = users;
    //   doors.push(findDoor);
    //
    //   return obj;
    // }));

    res.status(200).json({ users, doors });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const openDoorsNotSyncedUsers = async (req, res, next) => {
  let doorIds = req.body;
  let { users, doors } = await getUsersNotSynced(doorIds);

  res.status(200).json({ users, doors });
}

export const syncDoors = async (req, res, next) => {
  try {
    let { userId, doorId } = req.body;

    let findDoor = await DoorModel.findById(doorId, "-_id ip port type").lean();
    if (!findDoor) throw { status: 400, message: "doorNotFound" };

    let user = await UserModel.findByIdAndUpdate(userId, { 
      $addToSet: { sync: { ip: findDoor.ip, port: findDoor.port, type: findDoor.type } }
    }, { new: true, select: "_id" });
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json({ message: "synced" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const existsDoorEvent = async (req, res, next) => {
  try {
    let { door, serialNo, employeeNoString, time } = req.body;
    let event = await EventModel.findOne({
      door,
      employeeNoString,
      time: { $gte: new Date(new Date(time).getTime() - 60000), $lte: new Date(new Date(time).getTime() + 60000) },
    }, "_id").lean();
    if (!event) {
      return res.status(200).json({ exists: false });
    }

    res.status(200).json({ exists: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};