import { UserModel } from "../../models/data/user.js";
import { DepartmentModel } from "../../models/data/department.js";
import { CalendarModel } from "../../models/settings/calendar.js";
// import { WorkerModel } from "../../models/data/worker.js";
import { canCreate } from "../../middleware/role.js"
import { hash } from "argon2";
import { UserQueryFilter, UserCreate, UserUpdate, AddUserCalendar, UpdateUserCalendar } from "../../validations/data/user.js";
import { getIo, emitToAdmin } from "../../utils/socket.io.js"
import { getRedisAllData } from "../../utils/redis.js"
let select = 'fullName role faceUrl department gender status employeeNo';

export const canView = (user) => {
  let returnedData = {
    "admin": { role: { $in: ["boss", "chief", "worker", "security", "guest"] } },
    "boss": { role: { $in: ["chief", "worker", "security", "guest"] } },
    "chief": { role: "worker", department: user.department },
    "security": { _id: user._id },
    "worker": { _id: user._id }
  };

  return returnedData[user.role];
};

export const all = async (req, res, next) => {
  try {
    let { error } = UserQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { page, limit, fullName, role, department, employeeNo, status, pick, users, ninUsers } = req.query;
    pick = pick ? JSON.parse(pick) : select;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(fullName && { fullName: new RegExp(fullName, 'i') }),
      ...(department && { department }),
      ...(role ? { role } : canView(req.user)),
      ...(employeeNo && { employeeNo }),
      ...(status && { status }),
      ...(users && { _id: { $in: users } }),
      ...(ninUsers && { _id: { $nin: ninUsers } }),
    };

    let count = await UserModel.countDocuments(filter);
    let data = await UserModel.find(filter, pick)
    .populate({ path: "department", select: "name" })
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
    let { error } = UserCreate(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let { role: userRole } = req.user;
    let { fullName, phone, password, role, faceUrl, gender, department, doors } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let latestEmployeeNo = await UserModel.findOne({}, 'employeeNo').sort({ employeeNo: -1 });
    let employeeNo = parseInt(latestEmployeeNo.employeeNo) + 1 || 1
    let newUser = await UserModel.create({ fullName, phone, password: await hash(password), role, faceUrl, gender, department, employeeNo, doors });
    let user = await UserModel.findById(newUser._id, select)
    .populate({ path: "department", select: "name" })
    .lean();

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();
    findSecuritySessions.forEach(session => {
      io.to(session._id).emit('new-user', { _id: user._id, fullName: user.fullName, faceUrl: user.faceUrl, employeeNo: user.employeeNo, gender: user.gender });
    })
    io.to("hr-script69").emit("new-user", { _id: user._id, fullName: user.fullName, faceUrl: user.faceUrl, employeeNo: user.employeeNo, gender: user.gender });
    await emitToAdmin("worker", { _id: user._id });

    let findDepartment = await DepartmentModel.findById(department, "-_id workTime.day").lean();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      let currentDate = new Date(year, month, day);
      let dayOfWeek = currentDate.getDay();

      let isWorkingDay = findDepartment.workTime.some(workDay => workDay.day === dayOfWeek);
      if (isWorkingDay) {
        calendar.push({
          user: user._id,
          date: currentDate,
          shift: "off",
          status: "active"
        });
      }
    }

    await CalendarModel.insertMany(calendar);

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findById(id, "-password -__v")
      .populate([
        {
          path: "department",
          select: "name",
        }
      ]);

    if (!user) throw { status: 400, message: "userNotFound" };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { pick } = req.query;

    pick = pick ? JSON.parse(pick) : `${select} phone doors`;
    let user = await UserModel.findById(id, pick);
    if (!user) throw { status: 404, message: "userNotFound" };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserCalendars = async (req, res, next) => {
  try {
    let { user, month, year } = req.query;
    if (!user) throw { status: 400, message: "userRequired" };

    let date = new Date();
    month = month || date.getMonth();
    year = year || date.getFullYear();

    let startDate = new Date(year, month, 1).setHours(0, 0, 0, 0);
    let endDate = new Date(year, month + 1, 0).setHours(23, 59, 59, 999);

    let calendars = await CalendarModel.find({ user, date: { $gte: startDate, $lte: endDate } }, "-user -createdAt -updatedAt -__v").sort({ date: 1 });

    res.status(200).json(calendars);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const addUserCalendar = async (req, res, next) => {
  try {
    let { error } = AddUserCalendar(req.body);
    if (error) throw { status: 400, message: error.details[0].message };
    let newCalnendar = (await CalendarModel.create(req.body));

    res.status(201).json(newCalnendar);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserCalendar = async (req, res, next) => {
  try {
    let { id } = req.params;
    let calendar = await CalendarModel.findById(id, "-user -createdAt -updatedAt -__v");
    res.status(200).json(calendar);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const updateUserCalendar = async (req, res, next) => {
  try {
    let { error } = UpdateUserCalendar(req.body);
    if (error) throw { status: 400, message: error.details[0].message };

    let calendar = await CalendarModel.findByIdAndUpdate(req.body._id, req.body, { new: true, select: "-user -createdAt -updatedAt -__v" });
    if (!calendar) throw { status: 400, message: "calendarNotFound" };

    res.status(200).json(calendar);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const createCalendarToUser = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findById(id, "_id department");
    if (!user) throw { status: 400, message: "userNotFound" };

    let department = await DepartmentModel.findById(user.department, "-_id workTime.day").lean();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    
    let daysInMonth = new Date(year, month + 1, 0).getDate();
    let calendar = [];

    for (let day = 1; day <= daysInMonth; day++) {
      let currentDate = new Date(year, month, day);
      let dayOfWeek = currentDate.getDay();

      let isWorkingDay = department.workTime.some(workDay => workDay.day === dayOfWeek);
      if (isWorkingDay) {
        calendar.push({
          user: user._id,
          date: currentDate,
          shift: "off",
          status: "active"
        });
      }
    }

    await CalendarModel.insertMany(calendar);

    res.status(200).json({ message: "ok" });
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
    ).populate({ path: "department", select: "name" });

    if (!user) throw { status: 400, message: "userNotFound" };
    await emitToAdmin("worker", { _id: user._id });

    // let findSecuritySessions = await getRedisAllData(`session:*:security`);
    // let io = await getIo();
    // findSecuritySessions.forEach(session => {
    //   io.to(session._id).emit('new-user', { _id: user._id, fullName: user.fullName, faceUrl: user.faceUrl, employeeNo: user.employeeNo, gender: user.gender });
    // });
    // io.to("hr-script69").emit("new-user", { _id: user._id, fullName: user.fullName, faceUrl: user.faceUrl, employeeNo: user.employeeNo, gender: user.gender });

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
    let { _id, fullName, phone, password, role, faceUrl, gender, department, doors } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let findUser = await UserModel.findById(_id, 'password').lean();
    if (!findUser) throw { status: 400, message: "userNotFound" };
    password = password ? await hash(password) : findUser.password;

    let user = await UserModel.findByIdAndUpdate(_id, { fullName, phone, password, role, faceUrl, gender, department, doors }, { new: true, select })
      .populate({ path: "department", select: "name" });

    await emitToAdmin("worker", { _id: user._id });

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findByIdAndUpdate(id, { status: "deleted", sync: [] }, { new: true, select: "_id employeeNo" });
    if (!user) throw { status: 400, message: "userNotFound" };
    // await WorkerModel.updateMany({ user: id }, { status: "deleted" });

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();
    findSecuritySessions.forEach(session => {
      io.to(session._id).emit('user-remove', user.employeeNo);
    });
    io.to("hr-script69").emit('user-remove', user.employeeNo);

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};