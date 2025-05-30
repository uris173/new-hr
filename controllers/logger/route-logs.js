import { RouteLogsModel } from "../../models/logger/route-logs.js";
let select = "-__v -suspicious";

export const all = async (req, res, next) => {
  try {
    let { user, ip, method, url, page, limit } = req.query;

    page = page || 1;
    limit = limit || 30;
    let skip = (page - 1) * limit;
    let filter = {
      ...(user && { user }),
      ...(ip && { ip }),
      ...(method && { method }),
      ...(url && { url: new RegExp(url, 'i') }),
    };

    let count = await RouteLogsModel.countDocuments(filter);
    let data = await RouteLogsModel.find(filter, select)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: 'user', select: 'fullName role' })
      .lean();

    res.status(200).json({ count, data });
  } catch (error) {
    console.error(error);
    next(error);
  }
};