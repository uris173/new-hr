import { UserModel } from "../../models/data/user.js";
import { WorkerModel } from "../../models/data/worker.js";
import { canCreate } from "../../middleware/role.js"
import { hash } from "argon2";
import { UserQueryFilter, UserCreate, UserUpdate } from "../../validations/data/user.js";
import { getIo } from "../../socket.io.js"
let select = 'fullName role faceUrl department status employeeNo';

export const canView = (user) => {
  let returnedData = {
    "admin": { role: { $in: ["boss", "chief", "worker", "security", "guest"] } },
    "boss": { role: { $in: ["chief", "worker", "security", "guest"] } },
    "chief": { role: "worker", department: user.department },
    "worker": { _id: user._id }
  };

  return returnedData[user.role];
};

export const all = async (req, res, next) => {
  try {
    let { error } = UserQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { page, limit, fullName, role, department, employeeNo } = req.query;

    page = page || 1;
    limit = limit || 30;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(fullName && { fullName: new RegExp(fullName, 'i') }),
      ...(department && { department }),
      ...(role ? { role } : canView(req.user)),
      ...(employeeNo && { employeeNo })
    };

    let count = await UserModel.countDocuments(filter);
    let data = await UserModel.find(filter, select)
    .populate({ path: "department", select: "-_id name" })
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
    let { error } = UserCreate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { role: userRole } = req.user;
    let { fullName, phone, password, role, faceUrl, department, workTime, doors } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let latestEmployeeNo = await UserModel.findOne({}, 'employeeNo').sort({ employeeNo: -1 });
    let newUser = await UserModel.create({ fullName, phone, password: await hash(password), role, faceUrl, department, workTime, employeeNo: parseInt(latestEmployeeNo.employeeNo) + 1 || 1, doors });
    let user = await UserModel.findById(newUser._id, select)
    .populate({ path: "department", select: "-_id name" })
    .lean();

    // let io = await getIo();
    // io.emit('new-user', { fullName, faceUrl, employeeNo: latestEmployeeNo.employeeNo + 1 })

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findById(id, `${select} workTime phone doors`);
    if (!user) throw { status: 404, message: "userNotFound" };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findOneAndUpdate(
      { _id: id, status: { $in: ["active", "inactive"] } },
      [{ $set: { status: { $cond: { if: { $eq: ["$status", "active"] }, then: "inactive", else: "active" } } } }],
      { new: true, select }
    ).populate({ path: "department", select: "-_id name" });
    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    let { error } = UserUpdate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { role: userRole } = req.user;
    let { _id, fullName, phone, password, role, faceUrl, department, workTime, doors } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let findUser = await UserModel.findById(_id, 'password').lean();
    if (!findUser) throw { status: 400, message: "userNotFound" };
    password = password ? await hash(password) : findUser.password;

    let user = await UserModel.findByIdAndUpdate(_id, { fullName, phone, password, role, faceUrl, department, workTime, doors }, { new: true, select })
      .populate({ path: "department", select: "-_id name" });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true, select: "_id" });
    if (!user) throw { status: 400, message: "userNotFound" };
    await WorkerModel.findOneAndUpdate({ user: id }, { status: "deleted" });

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};