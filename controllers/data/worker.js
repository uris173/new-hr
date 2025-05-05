import { UserModel } from "../../models/data/user.js"
import { WorkerModel, WorkerHistoryModel } from "../../models/data/worker.js";
import { StaffPositionModel } from "../../models/settings/staff-position.js";
import { WorkerCreate, WorkerQueryFilter, WorkerUpdate } from "../../validations/data/worker.js";
let select = "user department createdAt status"

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

export const all = async (req, res, next) => {
  try {
    let { error } = WorkerQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { fullName, department, limit, page } = req.query;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(department && { department }),
    };

    if (department) filter.department = department;
    if (fullName) {
      let users = await UserModel.find({ fullName: new RegExp(fullName, "i") }).select("_id");
      let userIds = users.map(user => user._id);
      filter.user = { $in: userIds };
    }

    let count = await WorkerModel.countDocuments(filter);
    let data = await WorkerModel.find(filter, select)
      .populate([
        { path: "department", select: "-_id name" },
        { path: "user", select: "-_id fullName role faceUrl" }
      ])
      .sort({ _id: -1 })
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
    let { error } = WorkerCreate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { user, department, groups, birthDay, address, history } = req.body;

    const newWorker = await WorkerModel.create({ user, department, groups, birthDay, address, status: "active" });
    await Promise.all(history.map(async item => {
      let findStaff = await StaffPositionModel.findOne({ title: item.staffPosition }, '_id');
      if (!findStaff) await StaffPositionModel.create({ title: item.staffPosition });
      await WorkerHistoryModel.create({ worker: newWorker._id, ...item });
    }));

    let worker = await WorkerModel.findById(newWorker._id, select)
      .populate([
        { path: "department", select: "-_id name" },
        { path: "user", select: "-_id fullName role faceUrl" }
      ])

    res.status(201).json(worker);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getInfo = async (req, res, next) => {
  try {
    let { id } = req.params;

    let worker = await WorkerModel.findOne({ user: id }, '-_id -status -updatedAt -__v')
    .populate([
      { path: "user", select: "-_id -status -createdAt -updatedAt -__v" },
      { path: "department", select: "name" },
      { path: "group", select: "name" }
    ]).lean();

    if (!worker) throw { status: 404, message: "workerNotFound" };

    let history = await WorkerHistoryModel.findOne({ worker: worker._id }, '-_id -worker -createdAt -updatedAt').lean()

    res.status(200).json({ worker, history });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let worker = await WorkerModel.findById(id, `-__v -createdAt -updatedAt -status`).lean();
    if (!worker) throw { status: 404, message: "workerNotFound" };
    let history = await WorkerHistoryModel.find({ worker: id }, '-worker -createdAt -updatedAt -__v').lean();
    
    res.status(200).json({ worker, history })
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = WorkerUpdate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };
    
    let { _id, user, department, groups, birthDay, address, history } = req.body;

    let worker = await WorkerModel.findByIdAndUpdate({ _id }, { user, department, groups, birthDay, address }, { new: true, select: select })
      .populate([
        { path: "department", select: "-_id name" },
        { path: "user", select: "-_id fullName role faceUrl" }
      ])

    if (!worker) throw { status: 404, message: "workerNotFound" };

    await Promise.all(history.map(async item => {
      let findStaff = await StaffPositionModel.findOne({ title: item.staffPosition }, '_id');
      if (!findStaff) await StaffPositionModel.create({ title: item.staffPosition });
      if (item._id) await WorkerHistoryModel.findByIdAndUpdate(item._id, { ...item })
      else await WorkerHistoryModel.create({ worker: _id, ...item })
    }));

    res.status(200).json(worker);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let worker = await WorkerModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true, select: '_id' });
    if (!worker) throw { status: 400, message: "workerNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};