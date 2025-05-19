import { parentPort, workerData } from "worker_threads";

const processData = async (calendar, absences, holidays, events) => {
  const calendarMap = new Map(calendar.map(item => [item.date.getDate(), item]));
  const absenceMap = new Map(absences.map(item => [item.date.getDate(), item]));
  const holidayMap = new Map(holidays.map(item => [item.date.getDate(), item]));

  // Группируем события по дате и определяем время прихода/ухода
  const eventsMap = new Map();
  const attendanceMap = new Map();

  events.forEach(event => {
    const dateDay = event.date.getDate();

    // Добавляем событие в список событий дня
    if (!eventsMap.has(dateDay)) {
      eventsMap.set(dateDay, []);
    }
    eventsMap.get(dateDay).push(event);

    // Обновляем информацию о времени прихода/ухода
    if (!attendanceMap.has(dateDay)) {
      attendanceMap.set(dateDay, {
        arrival: event.time,
        departure: event.time,
      })
    }
  })
};