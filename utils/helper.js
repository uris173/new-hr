import { DepartmentModel } from "../models/data/department.js";
import { UserModel } from "../models/data/user.js";

export const departmentUsers = async (requestUser, field) => {
  if (["chief"].includes(requestUser.role)) {
    let findDepartmetnChief = await DepartmentModel.findOne({ _id: requestUser.department }, "chief").lean();
    let filter = { };
    if (requestUser._id.toString() === findDepartmetnChief.chief.toString()) {
      filter = { department: findDepartmetnChief._id };
      let users = await UserModel.find(filter, "_id").lean();
      users = users.map(u => u._id);

      return { [field]: { $in: users } };
    }

    return { [field]: { $in: [] } };
    // let filter = {
    //   ...(["chief"].includes(requestUser.role) ? { department: requestUser.department } : { })
    // };
    // let users = await UserModel.find(filter, "_id").lean();
    // users = users.map(u => u._id);
    //
    // return { [field]: { $in: users } };
  }

  return { };
};

export const calculateWorkDuration = (data) => {
  const events = data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  let totalMinutes = 0;
  let firstEnterTime = null;

  for (const event of events) {
    const eventTime = new Date(event.time);

    if (event.action === 'enter') {
      if (firstEnterTime === null) {
        firstEnterTime = eventTime; // Сохраняем самый ранний вход
      }
      // Если уже есть вход, ничего не делаем, ждём выхода
    } else if (event.action === 'exit' && firstEnterTime) {
      const durationMs = eventTime.getTime() - firstEnterTime.getTime();
      const durationMinutes = durationMs / (1000 * 60);
      totalMinutes += durationMinutes;
      firstEnterTime = null; // Сбрасываем после выхода
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  const seconds = Math.floor((totalMinutes % 1) * 60);

  return { hours, minutes, seconds };
};

export const reorderEventsWithFirstAndLast = (events) => {
  let firstEnter = null;
  let lastExit = null;

  for (const event of events) {
    if (event.action === 'enter') {
      if (!firstEnter || event.time < firstEnter.time) {
        firstEnter = event;
      }
    } else if (event.action === 'exit') {
      if (!lastExit || event.time > lastExit.time) {
        lastExit = event;
      }
    }
  }

  return [firstEnter, lastExit].filter(Boolean);
};