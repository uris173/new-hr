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
      { user: _id, date: { $gte: startDate, $lte: endDate } }, 
      'date reason type status'
    ).populate('reason', 'title shortName').lean();
    
    // let workDays = await WorkDayModel.find(
    //   { date: { $gte: startDate, $lte: endDate } }, 
    //   'date title'
    // ).lean();
    
    let holidays = await HolidayModel.find(
      { date: { $gte: startDate, $lte: endDate } }, 
      'date title'
    ).lean();
    
    let events = await EventModel.find(
      { user: _id, time: { $gte: startDate, $lte: endDate } }, 
      'date action time pictureURL'
    ).sort({ date: 1, time: 1 }).lean();
    
    // const worker = new Worker('./utils/workers/user-worker.js', { workerData: { year, month, calendar, absences, holidays, events } });


    const calendarMap = new Map(calendar.map(item => [item.date.getDate(), item]));
    const absenceMap = new Map(absences.map(item => [item.date.getDate(), item]));
    const holidayMap = new Map(holidays.map(item => [item.date.getDate(), item]));
  
    // Группируем события по дате и определяем время прихода/ухода
    const eventsMap = new Map();
    const attendanceMap = new Map();
  
    events.forEach(event => {
      const dateDay = event.time.getDate();
  
      // Добавляем событие в список событий дня
      if (!eventsMap.has(dateDay)) {
        eventsMap.set(dateDay, []);
      }
      eventsMap.get(dateDay).push(event);
  
      // Обновляем информацию о времени прихода/ухода
      if (!attendanceMap.has(dateDay)) {
        attendanceMap.set(dateDay, {
          arrival: null,
          departure: null,
        });
      }
  
      const attendance = attendanceMap.get(dateDay);
  
      // Если событие - вход, обновляем arrival
      if (event.action === "enter") {
        if (!attendance.arrival || event.time < attendance.arrival) {
          attendance.arrival = event.time;
        }
      }
  
      // Если событие - выход, обновляем departure
      if (event.action === "exit") {
        if (!attendance.departure || event.time > attendance.departure) {
          attendance.departure = event.time;
        }
      }
    })
  
    let result = [];
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const dateDay = currentDate.getDate();
      const dayOfWeek = currentDate.getDay();
  
      let dayData = {
        day,
        reason: null,
        dayStatus: "weekend",
        isWorkingDay: false,
        shift: 'off',
        status: 'planned',
        events: eventsMap.get(dateDay) || [],
        arrival: null,
        departure: null,
        workDuration: 0,
      };
  
      // Проверяем есть ли день в личном календаре пользователя
      if (calendarMap.has(dateDay)) {
        const calendarItem = calendarMap.get(dateDay);
        const attendance = attendanceMap.get(dateDay);

        // Добавляем информацию о времени прихода и ухода
        dayData.arrival = attendance?.arrival || null;
        dayData.departure = attendance?.departure || null;
  
        // Вычисляем продолжительность рабочего дня (в часах)
        if (dayData.arrival && dayData.departure) {
          dayData.workDuration = calculateWorkDuration(dayData.events);
        }
  
        dayData.isWorkingDay = true;
        dayData.dayStatus = "workday"
        dayData.shift = calendarItem.shift;
        dayData.status = calendarItem.status;
      }

      console.log(dayData);
    }

  } catch (error) {
    console.error(error);
    next(error);
  }
}

const calculateWorkDuration = (data) => {
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
