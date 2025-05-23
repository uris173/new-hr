import { Worker } from "worker_threads";
import { UserModel } from "../../models/data/user.js";
import { EventModel } from "../../models/data/event.js";

import { CalendarModel } from "../../models/settings/calendar.js";
import { AbsenceModel } from "../../models/settings/absence.js";
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

    let calendar = await CalendarModel.find({ user: _id, date: { $gte: startDate, $lte: endDate } }, 'date shift status').lean();

    let absences = await AbsenceModel.find(
      { user: _id, start: { $lte: endDate }, end: { $gte: startDate } }, 
      'date reason start end'
    ).populate({ path: 'reason', select: 'title' }).lean();
    
    let holidays = await HolidayModel.find(
      { date: { $gte: startDate, $lte: endDate } }, 
      'date title'
    ).lean();
    
    let events = await EventModel.find(
      { user: _id, time: { $gte: startDate, $lte: endDate } }, 
      '-_id date action time pictureURL'
    ).sort({ date: 1, time: 1 }).lean();
    
    const worker = new Worker('./utils/workers/user-worker.js', { workerData: { year, month, calendar, absences, holidays, events } });
    
    worker.on("message", (data) => {
      res.status(200).json({ year, month, data });
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      throw error;
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        const exitError = new Error(`Worker stopped with exit code ${code}`);
        console.error(exitError);
        throw code;
      }
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};