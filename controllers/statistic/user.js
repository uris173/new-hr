import { UserModel } from "../../models/data/user.js";
import { DepartmentModel } from "../../models/data/department.js";
import { EventModel } from "../../models/data/event.js";

import { CalendarModel } from "../../models/settings/calendar.js";
import { AbsenceModel } from "../../models/settings/absence.js";
import { WorkDayModel } from "../../models/settings/work-day.js";
import { HolidayModel } from "../../models/settings/holiday.js";

export const getUserCalendar = async (req, res, next) => {
  try {
    let { _id, month, year } = req.query;

    let date = new Date();
    month = parseInt(month) || date.getMonth();
    year = parseInt(year) || date.getFullYear();

    let startDate = new Date(year, month, 1, 0, 0, 0);
    let endDate = new Date(year, month + 1, 0, 23, 59, 59);

    let user = await UserModel.findById(_id, "department").lean();
    if (!user) throw { status: 404, message: "userNotFound" };

    let department = await DepartmentModel.findById(user.department, "workTime").lean();
    let calendar = await CalendarModel.find({ user: _id, date: { $gte: startDate, $lte: endDate } }, 'date shift status').lean();

    let absences = await AbsenceModel.find(
      { user: _id, date: { $gte: startDate, $lte: endDate } }, 
      'date reason type status'
    ).populate('reason', 'title shortName').lean();
    
    let workDays = await WorkDayModel.find(
      { date: { $gte: startDate, $lte: endDate } }, 
      'date title'
    ).lean();
    
    let holidays = await HolidayModel.find(
      { date: { $gte: startDate, $lte: endDate } }, 
      'date title'
    ).lean();
    
    let events = await EventModel.find(
      { user: _id, date: { $gte: startDate, $lte: endDate } }, 
      'date time status'
    ).sort({ date: 1, time: 1 }).lean();

    
  } catch (error) {
    console.error(error);
    next(error);
  }
}