import { EventModel } from "../../models/data/event.js";
import { DoorModel } from "../../models/settings/door.js";
import { UserModel } from "../../models/data/user.js";
import { EventQueryFilter } from "../../validations/data/event.js";
import { getIo } from "../../utils/socket.io.js";
import { getUsers } from "../../utils/helper.js";
let select = "-createdAt -updatedAt -__v";

export const all = async (req, res, next) => {
  try {
    let { error } = EventQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };
    
    let { limit, page, type, user, door, department, branch } = req.query;

    let depUsers = await getUsers(req.user, "user");

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      ...depUsers,
      ...(type && { type }),
      ...(user && { user }),
      ...(door && { door }),
    };

    if (department) {
      let users = await UserModel.find({ department }, "_id").lean();
      filter.user = { $in: users.map(u => u._id) };
    }
    if (branch) {
      let doors = await DoorModel.find({ branch }, "_id").lean();
      filter.door = { $in: doors.map(d => d._id) };
    }

    let count = await EventModel.countDocuments(filter);
    let data = await EventModel.find(filter, select)
      .populate([
        {
          path: "user",
          select: "fullName role department faceUrl",
          populate: {
            path: "department",
            select: "name type"
          }
        },
        {
          path: "door",
          select: "branch title",
          populate: {
            path: "branch",
            select: "title"
          }
        }
      ])
      .sort({ time: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    res.status(200).json({ count, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    let { type, action, time, user, door } = req.body;

    let findUser = await UserModel.findById(user, "_id");
    if (!findUser) throw { status: 404, message: "userNotFound" };
    let findDoor = await DoorModel.findById(door, "_id");
    if (!findDoor) throw { status: 404, message: "doorNotFound" };

    await EventModel.create({ type, action, time, user, door });

    res.status(201).json({ message: "ok" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const eventSync = async (req, res, next) => {
  try {
    let { start, end, door } = req.body;

    let findDoor = await DoorModel.find({ _id: door }, "ip port login password");
    let io = await getIo();
    io.to("hr-script69").emit("event-sync", { start, end, door: findDoor });

    res.status(200).json({ message: "syncStarted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};