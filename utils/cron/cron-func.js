import { UserModel } from "../../models/data/user.js";
import { CalendarModel } from "../../models/settings/calendar.js";
import { DoorLoggerModel } from "../../models/logger/door.js";
import { DoorModel } from "../../models/settings/door.js";
import { getIo } from "../socket.io.js";
import tcp from "tcp-ping";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function* getUserBatches(batchSize = 100) {
  let skip = 0;
  while (true) {
    const users = await UserModel.find({ status: "active" }, "_id")
      .skip(skip)
      .limit(batchSize)
      .lean();

    if (!users.length) break;
    yield users;
    skip += batchSize;
  }
};

async function* getDatesByWeekDay (year, month, weekDay) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dates = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    if (date.getDay() === weekDay) {
      dates.push(date);
    }
  }
  return dates;
};

export const createCalendar = async () => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;

    for await (const users of getUserBatches(100)) {
      for (const user of users) {
        const prevCalendars = await CalendarModel.find({
          user: user._id,
          date: {
            $gte: new Date(prevYear, prevMonth, 1, 0, 0, 0),
            $lte: new Date(prevYear, prevMonth + 1, 0, 23, 59, 59)
          }
        }, "date shift status").lean();

        if (!prevCalendars.length) continue;

        const weekDayMap = new Map();
        prevCalendars.forEach(calendar => {
          const weekDay = new Date(calendar.date).getDay();
          if (!weekDayMap.has(weekDay)) weekDayMap.set(weekDay, []);
          weekDayMap.get(weekDay).push(calendar);
        });

        const newCalendars = [];
        for (let weekDay of weekDayMap.keys()) {
          const template = weekDayMap.get(weekDay)[0];
          const dates = getDatesByWeekDay(year, month, weekDay);
          for (const date of dates) {
            newCalendars.push({
              user: user._id,
              date,
              shift: template.shift,
              status: template.status
            });
          }
        }

        if (newCalendars.length) {
          await CalendarModel.insertMany(newCalendars);
        }
      }

      await sleep(5000);
    }
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
          console.log(`Ping: ${data.avg}`, `Door: ${door.ip}:${door.port}`)
          if (err || !data.avg) {
            resolve("offline");
            await DoorModel.updateOne({ _id: door._id }, { doorStatus: "offline" });
            await DoorLoggerModel.create({ door: door._id, status: "offline" });
          } else {
            resolve("online");
            await DoorModel.updateOne({ _id: door._id }, { doorStatus: "online" });
            await DoorLoggerModel.create({ avg: data.avg, door: door._id, status: "online" });
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