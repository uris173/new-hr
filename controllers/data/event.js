import { EventModel } from "../../models/data/event.js";
import { UserModel } from "../../models/data/user.js";
import { EventQueryFilter } from "../../validations/data/event.js";
let select = "-createdAt -updatedAt -__v";

export const all = async (req, res, next) => {
  try {
    let { error } = EventQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };
    
    let { limit, page, type, user, door, department } = req.query;

    limit = limit || 30;
    page = page || 1;
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
          select: "title type"
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