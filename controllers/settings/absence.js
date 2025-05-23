import { AbsenceModel } from "../../models/settings/absence.js";
import { AbsenceQueryFilter, CreateAbsence, UpdateAbsence } from "../../validations/settings/absence.js"

export const all = async (req, res, next) => {
  try {
    let { error } = AbsenceQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { user, year, month, reason, page, limit } = req.query;

    let date = new Date();
    month = parseInt(month) || date.getMonth();
    year = parseInt(year) || date.getFullYear();

    const startOfMonth = new Date(year, month, 1); // Начало месяца
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      ...(user && { user }),
      ...(reason && { reason }),
      $or: [
        { start: { $lte: endOfMonth }, end: { $gte: startOfMonth } }
      ]
    };

    let count = await AbsenceModel.countDocuments(filter);
    let data = await AbsenceModel.find(filter, "-__v -updatedAt")
      .populate([
        { path: "user", select: "-_id fullName" },
        { path: "reason", select: "-_id title shornName" }
      ])
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
    let { error } = CreateAbsence(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let newAbsence = await AbsenceModel.create(req.body);
    let absence = await AbsenceModel.findById(newAbsence._id, "-__v -updatedAt")
      .populate([
        { path: "user", select: "-_id fullName" },
        { path: "reason", select: "-_id title shornName" }
      ]).lean();

    res.status(201).json(absence);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let absence = await AbsenceModel.findById(req.params.id, "-__v -createdAt -updatedAt")
    if (!absence) throw { status: 400, message: "absenceNotFound" };

    res.status(200).json(absence);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = UpdateAbsence(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let absence = await AbsenceModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select: "-__v -updatedAt" })
      .populate([
        { path: "user", select: "-_id fullName" },
        { path: "reason", select: "-_id title shornName" }
      ]).lean();

    if (!absence) throw { status: 400, message: "absenceNotFound" };

    res.status(200).json(absence);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let absence = await AbsenceModel.findByIdAndDelete(req.params.id);
    if (!absence) throw { status: 400, message: "absenceNotFound" };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};