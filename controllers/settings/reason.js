import { ReasonModel } from "../../models/settings/reason.js";
import { ReasonQueryFilter, ReasonCreate, ReasonUpdate } from "../../validations/settings/reason.js";
const select = "-__v -updatedAt";

export const all = async (req, res, next) => {
  try {
    let { error } = ReasonQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { title, limit, page } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 30;
    let skip = (page - 1) * limit;
    let filter = {
      ...(title && { title: new RegExp(title, "i") }),
    };

    let count = await ReasonModel.countDocuments(filter);
    let data = await ReasonModel.find(filter, select)
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
    let { error } = ReasonCreate(req.body);
    if (error) throw { status: 400, message: error.details[0].message }; 

    let newReason = await ReasonModel.create(req.body);
    let reason = await ReasonModel.findById(newReason._id, select).lean();

    res.status(201).json(reason);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let reason = await ReasonModel.findById(id, `${select} -createdAt`).lean();
    if (!reason) throw { status: 400, message: "reasonNotFound" };

    res.status(200).json(reason);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = ReasonUpdate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let reason = await ReasonModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select });
    if (!reason) throw { status: 400, message: "reasonNotFound" };

    res.status(200).json(reason);
  } catch (error) {
    console.error(error);    
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { error } = ReasonUpdate(req.params);
    if (error) throw { status: 400, message: error.details[0].message };

    let reason = await ReasonModel.findByIdAndUpdate(req.params._id, { status: "deleted" });
    if (!reason) throw { status: 400, message: "reasonNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);    
    next(error);
  }
};