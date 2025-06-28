import { UserModel } from "../../models/data/user.js";
import { DoorModel } from "../../models/settings/door.js";
import { DepartmentModel } from "../../models/data/department.js";
import { CalendarModel } from "../../models/settings/calendar.js";
import { AbsenceModel } from "../../models/settings/absence.js";
import { HolidayModel } from "../../models/settings/holiday.js";
import { EventModel } from "../../models/data/event.js";
import { UserSyncedDoorModel } from "../../models/settings/user-synced-door.js";
// import { WorkerModel } from "../../models/data/worker.js";
import { canCreate } from "../../middleware/role.js"
import { hash } from "argon2";

import { getRedisAllData } from "../../utils/redis.js"
import { getIo } from "../../utils/socket.io.js"
import { UserQueryFilter, UserCreate, UserUpdate, AddUserCalendar, UpdateUserCalendar } from "../../validations/data/user.js";
import { calculateWorkDuration, reorderEventsWithFirstAndLast } from "../../utils/helper.js";
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

export const securityUsers = async (req, res, next) => {
  try {
    let { error } = UserQueryFilter(req.query);
    if (error) throw { status: 400, message: error.details[0].message };

    let { _id } = req.user;
    let { page, limit, fullName, role, employeeNo, status, pick } = req.query;
    pick = pick ? JSON.parse(pick) : select;

    limit = parseInt(limit) || 30;
    page = parseInt(page) || 1;
    let skip = (page - 1) * limit;
    let filter = {
      status: { $ne: "deleted" },
      ...(fullName && { fullName: new RegExp(fullName, 'i') }),
      ...(role ? { role } : canView(req.user)),
      ...(employeeNo && { employeeNo }),
      ...(status && { status })
    };

    let security = await UserModel.findById(_id, "doors").lean();
    let syncedDoorsUsers = await UserSyncedDoorModel.distinct("user", { door: { $in: security.doors }, status: "success" }).lean();
    
    let count = await UserModel.countDocuments({ _id: { $in: syncedDoorsUsers }, ...filter });
    let data = await UserModel.find({ _id: { $in: syncedDoorsUsers }, ...filter }, pick)
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
    let { fullName, phone, password, role, faceUrl, gender, department, doors, birthDay, address } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let latestEmployeeNo = await UserModel.aggregate([
      { $match: { employeeNo: { $exists: true } } }, // Фильтруем документы, где employeeNo существует
      {
        $addFields: {
          employeeNoNumber: { $toInt: "$employeeNo" } // Преобразуем employeeNo в число
        }
      },
      { $sort: { employeeNoNumber: -1 } }, // Сортируем по числовому значению
      { $limit: 1 }, // Берем только один документ
      { $project: { employeeNo: 1 } } // Проецируем только поле employeeNo
    ]);
    let employeeNo = latestEmployeeNo.length > 0 ? parseInt(latestEmployeeNo[0].employeeNo) + 1 : 1;

    let newUser = await UserModel.create({ fullName, phone, password: await hash(password), role, faceUrl, gender, department, employeeNo, doors, birthDay, address });
    let user = await UserModel.findById(newUser._id, select)
      .populate({ path: "department", select: "name" })
      .lean();

    let io = await getIo();
    let findDoors = await DoorModel.find({ _id: { $in: doors } }, "ip port login password").lean();

    for (const door of findDoors) {
      await UserSyncedDoorModel.create({ user: user._id, door: door._id })
      io.to("hr-script69").emit("new-user", { _id: user._id, door, fullName, faceUrl, employeeNo: employeeNo.toString(), gender });
    };

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
          shift: "full_day",
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

    pick = pick ? JSON.parse(pick) : `${select} phone birthDay address`;
    let user = await UserModel.findById(id, pick).lean();
    if (!user) throw { status: 400, message: "userNotFound" };

    let syncedDoors = await UserSyncedDoorModel.find({ user: id, status: "success" }, "-_id door").lean();
    user.doors = syncedDoors.map(d => d.door);

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
    console.log(req.body)
    let { error } = AddUserCalendar(req.body);
    if (error) throw { status: 400, message: error.details[0].message };
    let newCalnendar = await CalendarModel.create(req.body);

    res.status(201).json(newCalnendar);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const getUserCalendar = async (req, res, next) => {
  try {
    let { id } = req.params;

    let calendar = await CalendarModel.findById(id, "-createdAt -updatedAt -__v");
    if (!calendar) throw { status: 404, message: "calendarNotFound" };

    let startDate = new Date(calendar.date).setHours(0, 0, 0, 0);
    let endDate = new Date(calendar.date).setHours(23, 59, 59, 999);

    let holiday = await HolidayModel.findOne({ date: { $gte: startDate, $lte: endDate  } }, "title").lean();
    let absence = await AbsenceModel.findOne({
      user: calendar.user,
      start: { $lte: endDate }, end: { $gte: startDate }
    }, "reason")
      .populate({ path: 'reason', select: 'title' });

    let reason = holiday?.title || absence?.reason?.title || null
    let dayStatus = holiday ? "holiday" : absence ? "absence" : calendar.shift === "off" ? "weekend" : "workday";
    let isWorkingDay = holiday ? false : absence ? false : calendar.shift === "off" ? false : true;

    let calendarEvents = await EventModel.find({
      user: calendar.user,
      time: { $gte: startDate, $lte: endDate },
    }, "-_id date action time pictureURL").sort({ time: 1 }).lean();

    let events = reorderEventsWithFirstAndLast(calendarEvents);
    let enterEvent = events.find(event => event.action === "enter");
    let exitEvent = events.find(event => event.action === "exit");

    let dayDaya = {
      calendarId: id,
      day: calendar.date.getDate(),
      reason,
      dayStatus,
      isWorkingDay,
      attended: events.length > 0 ? true : false,
      arrival: enterEvent ? enterEvent?.time : null,
      departure: exitEvent ? exitEvent?.time : null,
      events,
      workDuration: calculateWorkDuration(calendarEvents)
    };

    res.status(200).json(dayDaya);
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
    // await emitToAdmin("worker", { _id: user._id });

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
    let { _id, fullName, phone, password, role, faceUrl, gender, department, birthDay, address, doors } = req.body;

    let canUserCreate = canCreate(userRole, role);
    if (!canUserCreate) throw { status: 400, message: "youDontHaveAccess" };

    let findUser = await UserModel.findById(_id, 'password employeeNo').lean();
    if (!findUser) throw { status: 400, message: "userNotFound" };
    password = password ? await hash(password) : findUser.password;

    let user = await UserModel.findByIdAndUpdate(_id, { fullName, phone, password, role, faceUrl, gender, department, doors, birthDay, address }, { new: true, select })
      .populate({ path: "department", select: "name" });

    let io = await getIo();
    let findDoors = await DoorModel.find({ _id: { $in: doors } }, "ip port login password").lean();

    let findSyncedDoors = await UserSyncedDoorModel.find({ user: _id, status: "success" }, "-_id door").lean()
    let removeSyncedDoors = findSyncedDoors.filter(d => !doors.includes(d.door.toString()));
    if (removeSyncedDoors.length) {
      let removedDoorIds = removeSyncedDoors.map(d => d.door.toString());
      let removedDoors = await DoorModel.find({ _id: { $in: removedDoorIds } }, "ip port login password").lean();

      for (const door of removedDoors) {
        io.to("hr-script69").emit('user-remove', { _id: user._id, door, employeeNo: findUser.employeeNo });
      }
    }

    for (const door of findDoors) {
      let findSuccessSync = await UserSyncedDoorModel.findOne({ user: user._id, door: door._id, status: "success" })
      if (findSuccessSync) continue

      await UserSyncedDoorModel.findOneAndUpdate({ user: _id, door: door._id }, { status: "pending" }, { upsert: true });
      io.to("hr-script69").emit("new-user", { _id: user._id, door, fullName, faceUrl, employeeNo: findUser.employeeNo, gender });
    };

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    let { id } = req.params;

    let user = await UserModel.findByIdAndUpdate(id, { status: "deleted" }, { new: true, select: "_id employeeNo" });
    if (!user) throw { status: 400, message: "userNotFound" };

    let syncedDoors = await UserSyncedDoorModel.find({ user: user._id }, "door")
      .populate({ path: "door", select: "ip port login password" })
      .lean();

    let findSecuritySessions = await getRedisAllData(`session:*:security`);
    let io = await getIo();
    
    for (const syncedDoor of syncedDoors) {
      io.to("hr-script69").emit('user-remove', { _id: syncedDoor._id, door: syncedDoor.door, employeeNo: user.employeeNo });
      for (const session of findSecuritySessions) {
        io.to(session._id).emit('user-remove', { _id: syncedDoor._id, door: syncedDoor.door, employeeNo: user.employeeNo });
      };
    };

    res.status(200).json({ message: "deleted" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};