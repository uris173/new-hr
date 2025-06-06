import { DoorModel } from "../../models/settings/door.js";
import { DoorQueryFilter, CreateDoor, UpdateDoor } from "../../validations/settings/door.js";
let select = '-__v -updatedAt';

export const all = async (req, res, next) => {
  try {
    let { error } = DoorQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { branch, title, status, doorStatus, page, limit } = req.query;
    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: status ? status : { $ne: "deleted" },
      ...(doorStatus && { doorStatus }),
      ...(branch && { branch }),
      ...(title && { title: new RegExp(title, "i") }),
    };

    let count = await DoorModel.countDocuments(filter);
    let data = await DoorModel.find(filter, `${select} -password`)
      .populate({ path: "branch", select: "title" })
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
    let { error } = CreateDoor(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let newDoor = await DoorModel.create(req.body);
    let door = await DoorModel.findById(newDoor._id, `${select} -password`)
      .populate({ path: "branch", select: "title" });

    res.status(201).json(door);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let door = await DoorModel.findById(req.params.id, `${select} -createdAt -status`);
    if (!door) throw { status: 400, message: "doorNotFound" };

    res.status(200).json(door);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    let { id } = req.params;

    let door = await DoorModel.findOneAndUpdate(
      { _id: id, status: { $in: ["active", "inactive"] } },
      [{ $set: { status: { $cond: { if: { $eq: ["$status", "active"] }, then: "inactive", else: "active" } } } }],
      { new: true, select }
    ).populate({ path: "branch", select: "title" });
    if (!door) throw { status: 400, message: "doorNotFound" };

    res.status(200).json(door);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = UpdateDoor(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let door = await DoorModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select: `${select} -password` })
      .populate({ path: "branch", select: "title" });
    if (!door) throw { status: 400, message: "doorNotFound" };

    res.status(200).json(door);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let door = await DoorModel.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true });
    if (!door) throw { status: 400, message: "doorNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};