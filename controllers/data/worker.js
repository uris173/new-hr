import { WorkerModel, WorkerModelHistory } from "../../models/data/worker.js";
import { WorkerCreate, WorkerQueryFilter } from "../../validations/data/worker.js";
let select = "user department createdAt status"

export const all = async (req, res, next) => {
  try {
    let { error } = WorkerQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { fullName, department, limit, page } = req.query;

    page = page || 1;
    limit = limit || 30;
    let skip = (page - 1) * limit;
    let filter = { };

    if (department) filter.department = department;
    if (fullName) {
      let users = await UserModel.find({ fullName: new RegExp(fullName, "i") }).select("_id");
      let userIds = users.map(user => user._id);
      filter.user = { $in: userIds };
    }

    let count = await WorkerModel.countDocuments(filter, select);
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

    let { user, department, groups, gender, birthDay, address, history } = req.body;

    const newWorker = WorkerModel.create({ user, department, groups, gender, birthDay, address, status: "active" });
    await Promise.all(history.map(item => {
      WorkerModelHistory.create({ worker: newWorker._id, ...item });
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

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let worker = await WorkerModel.findById(id, `-__v -createdAt -updatedAt -status`).lean();
    if (!worker) throw { status: 404, message: "workerNotFound" };
  } catch (error) {
    console.error(error);
    next(error);
  }
};