import { HolidayModel } from "../../models/settings/holiday.js";
import { holidayQueryFilter, createHoliday, updateHoliday } from "../../validations/settings/holiday.js";
let select = "-__v -updatedAt";

export const all = async (req, res, next) => {
  try {
    let { error } = holidayQueryFilter(req.query);
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

    let count = await HolidayModel.countDocuments(filter);
    let data = await HolidayModel.find(filter, select)
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
    let { error } = createHoliday(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let newHoliday = await HolidayModel.create(req.body);
    let holiday = await HolidayModel.findById(newHoliday._id, select);

    res.status(201).json(holiday);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let holiday = await HolidayModel.findById(id, `${select} -createdAt`);
    if (!holiday) throw { status: 400, message: "holidayNotFound" };

    res.status(200).json(holiday);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = updateHoliday(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let holiday = await HolidayModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select: select });
    if (!holiday) throw { status: 400, message: "holidayNotFound" };

    res.status(200).json(holiday);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let holiday = await HolidayModel.findByIdAndDelete(id);
    if (!holiday) throw { status: 400, message: "holidayNotFound" };

    res.status(200).json(holiday);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};