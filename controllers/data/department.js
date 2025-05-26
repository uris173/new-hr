import { DepartmentModel } from "../../models/data/department.js";
import { DepartmentQueryFilter, CreateDepartment, UpdateDepartment } from "../../validations/data/department.js";
import { emitToAdmin } from "../../utils/socket.io.js";
let select = '-type -parent -__v -updatedAt';

export const all = async (req, res, next) => {
  try {
    let { error } = DepartmentQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { limit, page, name, type, parent, chief, pick } = req.query
    pick = pick ? JSON.parse(pick) : select;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(name && { name: new RegExp(name, 'i') }),
      ...(type && { type }),
      ...(parent && { parent }),
      ...(chief && { chief }),
    };

    let count = await DepartmentModel.countDocuments(filter);
    let data = await DepartmentModel.find(filter, pick)
    .populate([
      // { path: 'parent', select: '-_id name' },
      { path: 'chief', select: '-_id fullName' }
    ])
    .sort({ _id: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

    res.status(200).json({
      count,
      page,
      limit,
      totalPage: Math.ceil(count / limit),
      data
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    let { error } = CreateDepartment(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { name, workTime, chief } = req.body; // type, parent
    
    const newDepartment = await DepartmentModel.create({ name, workTime, chief: chief || null });
    let data = await DepartmentModel.findById(newDepartment._id, select)
    .populate([
      // { path: 'parent', select: 'name' },
      { path: 'chief', select: 'fullName' }
    ])
    .lean();

    await emitToAdmin("department", { _id: data._id });

    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await DepartmentModel.findOneAndUpdate(
      { _id: id, status: { $in: ["active", "inactive"] } },
      [{ $set: { status: { $cond: { if: { $eq: ["$status", "active"] }, then: "inactive", else: "active" } } } }],
      { new: true, select }
    )
    .populate([
      // { path: 'parent', select: 'name' },
      { path: 'chief', select: 'fullName' }
    ])
    .lean();

    if (!department) throw { status: 400, message: "departmentNotFound" };
    await emitToAdmin("department", { _id: department._id });

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { pick } = req.query;
    pick = pick ? JSON.parse(pick) : `${select} -createdAt -status`;

    let department = await DepartmentModel.findById(id, pick);
    if (!department) throw { status: 400, message: "departmentNotFound" };

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = UpdateDepartment(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { _id, name, workTime, chief } = req.body; // type, parent
    let department = await DepartmentModel.findByIdAndUpdate(_id, { name, workTime, chief: chief || null }, { new: true, select })
    .populate([
      // { path: 'parent', select: 'name' },
      { path: 'chief', select: 'fullName' }
    ])
    .lean();
    await emitToAdmin("department", { _id: department._id });

    res.status(200).json(department);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let department = await DepartmentModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true, select: "_id" });
    if (!department) throw { status: 400, message: "departmentNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};