import { BranchModel } from "../../models/settings/branch.js";
import { BranchQueryFilter, CreateBranch, UpdateBranch } from "../../validations/settings/branch.js";
let select = "-__v -updatedAt -location.type";

export const all = async (req, res, next) => {
  try {
    let { error } = BranchQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { title, page, limit } = req.query;
    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(title && { title: new RegExp(title, "i") }),
    };

    let count = await BranchModel.countDocuments(filter);
    let data = await BranchModel.find(filter, select)
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
    let { error } = CreateBranch(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let newBranch = await BranchModel.create(req.body);
    let branch = await BranchModel.findById(newBranch._id, select);

    res.status(201).json(branch);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let branch = await BranchModel.findById(req.params.id, `${select} -createdAt -status`);
    if (!branch) throw { status: 400, message: "branchNotFound" };

    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    let { id } = req.params;
    let branch = await BranchModel.findOneAndUpdate(
      { _id: id, status: { $in: ["active", "inactive"] } },
      [{ $set: { status: { $cond: { if: { $eq: ["$status", "active"] }, then: "inactive", else: "active" } } } }],
      { new: true, select }
    );
    if (!branch) throw { status: 400, message: "branchNotFound" };

    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = UpdateBranch(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let branch = await BranchModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select });
    if (!branch) throw { status: 400, message: "branchNotFound" };

    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let branch = await BranchModel.findByIdAndUpdate(req.params.id, { status: "deleted" }, { new: true, select });
    if (!branch) throw { status: 400, message: "branchNotFound" };

    res.status(200).json(branch);
  } catch (error) {
    console.error(error);
    next(error);
  }
};