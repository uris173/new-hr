import { UserModel } from "../../models/data/user.js"
import { WorkerHistoryModel } from "../../models/data/worker.js";
import { StaffPositionModel } from "../../models/settings/staff-position.js";
import { WorkerCreate, WorkerQueryFilter, WorkerUpdate } from "../../validations/data/worker.js";
let select = "-__v -updatedAt"

export const getStaffPosition = async (req, res, next) => {
  try {
    let { title } = req.body;
    if (!title) throw { status: 400, message: "titleNotFound" };

    let findStaff = await StaffPositionModel.find({ title: new RegExp(title, 'i') }, '-_id title');
    
    res.status(200).json(findStaff);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const allWorkerHistory = async (req, res, next) => {
  try {
    let { error } = WorkerQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { user, limit, page } = req.query;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = { user };

    let count = await WorkerHistoryModel.countDocuments(filter);
    let workerHistory = await WorkerHistoryModel.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    res.status(200).json({ count, workerHistory });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createHistory = async (req, res, next) => {
  try {
    let { error } = WorkerCreate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { user, company, staffPosition, enterDate, leaveDate, comment } = req.body;
    let newHistory = await WorkerHistoryModel.create({ user, company, staffPosition, enterDate, leaveDate, comment });
    let history = await WorkerHistoryModel.findById(newHistory._id, select).lean();

    res.status(201).json(history);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let history = await WorkerHistoryModel.findById(id, `${select} -createdAt`)
    if (!history) throw { status: 400, message: "workerHistoryNotFound" };

    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = WorkerUpdate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { _id, user, company, staffPosition, enterDate, leaveDate, comment } = req.body;

    let updatedHistory = await WorkerHistoryModel.findByIdAndUpdate(_id, { user, company, staffPosition, enterDate, leaveDate, comment }, { new: true });
    if (!updatedHistory) throw { status: 400, message: "workerHistoryNotFound" };

    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let deletedHistory = await WorkerHistoryModel.findByIdAndDelete(id);
    if (!deletedHistory) throw { status: 400, message: "workerHistoryNotFound" };

    res.status(200).json({ message: "Deleted!" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};