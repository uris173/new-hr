import { DoorLoggerModel } from "../../models/logger/door.js";
let select = "-__v -updatedAt";

export const all = async (req, res, next) => {
  try {
    let { door, status, limit, page } = req.query;

    limit = limit || 30;
    page = page || 1;
    let skip = (page - 1) * limit;
    let filter = {
      ...(door && { door }),
      ...(status && { status }),
    };

    let count = await DoorLoggerModel.countDocuments(filter);
    let data = await DoorLoggerModel.find(filter, select)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "door",
        select: "-_id title type",
        populate: {
          path: "branch",
          select: "-_id title",
        }
      })
      .lean();

    res.status(200).json({ count, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};