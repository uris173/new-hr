import { EventModel } from "../../models/data/event.js";
import { DoorModel } from "../../models/settings/door.js";
import { UserModel } from "../../models/data/user.js";
import { EventQueryFilter } from "../../validations/data/event.js";
import { getIo } from "../../utils/socket.io.js";
let select = "-createdAt -updatedAt -__v";

export const all = async (req, res, next) => {
  try {
    let { error } = EventQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };
    
    let { limit, page, type, user, door, department, branch } = req.query;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
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
          select: "branch title type",
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

export const eventSync = async (req, res, next) => {
  try {
    let { start, end } = req.body;
    let io = await getIo();
    io.to("hr-script69").emit("event-sync", { start, end });

    res.status(200).json({ message: "syncStarted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
}