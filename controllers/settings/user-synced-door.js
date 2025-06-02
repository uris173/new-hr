import { UserSyncedDoorModel } from "../../models/settings/user-synced-door.js";
import { DoorModel } from "../../models/settings/door.js";
import { CreateUserSyncedDoor } from "../../validations/settings/user-synced-door.js";
import { getRedisAllData } from "../../utils/redis.js"
import { getIo } from "../../utils/socket.io.js"

export const all = async (req, res, next) => {
  try {
    let { door, user, page, limit } = req.query;

    page = page || 1;
    limit = limit || 30;
    let skip = (page - 1) * limit;
    let filter = {
      ...(door && { door }),
      ...(user && { user })
    };

    let populate = null;
    if (door) populate = {
      path: "user",
      select: "faceUrl fullName department",
      populate: {
        path: "department",
        select: "-_id name",
      }
    };
    else if (user) populate = { path: "door", select: "title ip port" };

    let count = await UserSyncedDoorModel.countDocuments(filter);
    let data = await UserSyncedDoorModel.find(filter)
      .populate(populate)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    let doorInfo = await DoorModel.findById(door, "title ip port").lean();

    res.status(200).json({
      ...(door && { doorInfo }),
      count,
      data
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    let { error } = CreateUserSyncedDoor(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { user, door } = req.body;

    let newUserSyncedDoor = await UserSyncedDoorModel.create({ user, door });
    let data = await UserSyncedDoorModel.findById(newUserSyncedDoor._id).populate([
      { path: "user", select: "fullName faceUrl employeeNo gender" },
      { path: "door", select: "ip port login password" }
    ]).lean();

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();

    for (const session of findSecuritySessions) {
      io.to(session._id).emit('new-user', {
        _id: data.user._id,
        door: data.door,
        fullName: data.user.fullName,
        faceUrl: data.user.faceUrl,
        employeeNo: data.user.employeeNo,
        gender: data.user.gender
      });
    }

    io.to("hr-script69").emit("new-user", {
      _id: data.user._id,
      door: data.door,
      fullName: data.user.fullName,
      faceUrl: data.user.faceUrl,
      employeeNo: data.user.employeeNo,
      gender: data.user.gender
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const tryAgain = async (req, res, next) => {
  try {
    let data = await UserSyncedDoorModel.findById(req.params.id).populate([
      { path: "user", select: "fullName faceUrl employeeNo gender" },
      { path: "door", select: "ip port login password" }
    ]).lean();

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();

    for (const session of findSecuritySessions) {
      io.to(session._id).emit('new-user', {
        _id: data.user._id,
        door: data.door,
        fullName: data.user.fullName,
        faceUrl: data.user.faceUrl,
        employeeNo: data.user.employeeNo,
        gender: data.user.gender
      });
    };

    io.to("hr-script69").emit("new-user", {
      _id: data.user._id,
      door: data.door,
      fullName: data.user.fullName,
      faceUrl: data.user.faceUrl,
      employeeNo: data.user.employeeNo,
      gender: data.user.gender
    });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const remove = async (req, res, next) => {
  try {
    let data = await UserSyncedDoorModel.findById(req.params.id).populate([
      { path: "user", select: "employeeNo" },
      { path: "door", select: "ip port login password" }
    ]).lean();
    if (!data) throw { status: 400, message: "userSyncedDoorNotFound" };

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();
    for (const session of findSecuritySessions) {
      io.to(session._id).emit('user-remove', { door: data.door, employeeNo: data.user.employeeNo});
    };
    io.to("hr-script69").emit('user-remove', { door: data.door, employeeNo: data.user.employeeNo });

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};