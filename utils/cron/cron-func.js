import { UserModel } from "../../models/data/user.js";
import { CalendarModel } from "../../models/settings/calendar.js";
import { DepartmentModel } from "../../models/data/department.js";
import { DoorLoggerModel } from "../../models/logger/door.js";
import { DoorModel } from "../../models/settings/door.js";
import { getIo } from "../socket.io.js";
import tcp from "tcp-ping";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const getUserBatches = async (batchSize = 100) => {
  const total = await UserModel.countDocuments({ status: "active" });
  const batches = [];
  for (let skip = 0; skip < total; skip += batchSize) {
    const users = await UserModel.find({ status: "active" }, "_id")
      .skip(skip)
      .limit(batchSize)
      .lean();
    if (users.length) batches.push(users);
  }
  return batches;
};

export const getDatesByWeekDay = (year, month, weekDay) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1))
    .filter(date => date.getDay() === weekDay);
};

export const createCalendar = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const batches = await getUserBatches(100);
    for (const users of batches) {
      for (const user of users) {
        // Получаем департамент пользователя с рабочим расписанием
        const userWithDept = await UserModel.findById(user._id).populate({
          path: "department",
          select: "workTime"
        }).lean();

        if (!userWithDept?.department?.workTime?.length) continue;

        const workTime = userWithDept.department.workTime; // [{ day: 1, startTime, endTime }, ...]
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const newCalendars = [];

        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month, day);
          const weekDay = date.getDay(); // 0 - воскресенье, 1 - понедельник, ...

          // Находим рабочий день в расписании департамента
          const deptWorkDay = workTime.find(wt => wt.day === weekDay);
          if (deptWorkDay) {
            newCalendars.push({
              user: user._id,
              date,
              shift: "full_day", // или deptWorkDay.shift, если есть
              status: "active"
            });
          }
        }

        if (newCalendars.length) {
          await CalendarModel.insertMany(newCalendars);
        }
      }
      await sleep(5000); // если нужно делать паузы между батчами
    }
    console.log("Календари по департаменту успешно созданы");
  } catch (error) {
    console.error("Error in Create calendar:", error);
  }
};

export const checkDoorStatus = async () => {
  try {
    let doors = await DoorModel.find({ }, "title ip port type") // status: "active"
      .populate({ path: "branch", select: "-_id title" })
      .lean();
    let io = await getIo();

    let doorsInfo = await Promise.all(doors.map(async (door) => {
      door.status = await new Promise((resolve) => {
        tcp.ping({ address: door.ip, port: door.port, timeout: 1000 }, async (err, data) => {
          // console.log(`Ping: ${data.avg}`, `Door: ${door.ip}:${door.port}`)
          if (err || !data.avg) {
            resolve("offline");
            // await DoorModel.updateOne({ _id: door._id }, { status: "offline" });
            await DoorLoggerModel.create({ door: door._id, status: "offline" });
          } else {
            resolve("online");
            // await DoorModel.updateOne({ _id: door._id }, { status: "online" });
            // await DoorLoggerModel.create({ avg: data.avg, door: door._id, status: "online" });
          }
        });
      });

      return door;
    }));

    io.emit("doors-status", doorsInfo);
  } catch (error) {
    console.error("Error in Check door status:", error);
  }
};