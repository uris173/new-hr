import { WorkDayModel } from "../../models/settings/work-day.js";
import { workDayQueryFilter, createWorkDay, updateWorkDay } from "../../validations/settings/work-day.js";
let select = "-__v -updatedAt";

export const all = async (req, res, next) => {
  try {
    let { error } = workDayQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { title, year, page, limit } = req.query;
    
    year = parseInt(year) || new Date().getFullYear();
    const startOfYear = new Date(year, - 1, 11, 31, 23, 59, 59, 999);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;
    let skip = (page - 1) * limit;
    let filter = {
      ...(title && { title: new RegExp(title, "i") }),
      date: { $gte: startOfYear, $lte: endOfYear },
    };

    let count = await WorkDayModel.countDocuments(filter);
    let data = await WorkDayModel.find(filter, select)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ count, data });
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    let { error } = createWorkDay(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let newWorkDay = await WorkDayModel.create(req.body);
    let workDay = await WorkDayModel.findById(newWorkDay._id, select);

    res.status(201).json(workDay);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let workDay = await WorkDayModel.findById(id, `${select} -createdAt`);
    if (!workDay) throw { status: 400, message: "workDayNotFound" };

    res.status(200).json(workDay);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = updateWorkDay(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let workDay = await WorkDayModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select: select });
    if (!workDay) throw { status: 400, message: "workDayNotFound" };

    res.status(200).json(workDay);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let workDay = await WorkDayModel.findByIdAndDelete(id);
    if (!workDay) throw { status: 400, message: "workDayNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);    
    next(error);
  }
};