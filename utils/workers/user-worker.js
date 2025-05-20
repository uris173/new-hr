import { parentPort, workerData } from "worker_threads";

function parseTimeToMinutes(timeStr) {
  // Предполагается, что формат времени "HH:MM" или "HH:MM:SS"
  const timeParts = timeStr.split(':');
  return parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
}

const processData = async (year, month, calendar, absences, holidays, events) => {
  try {
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
  
      // Добавляем информацию о времени прихода и ухода
      if (attendanceMap.has(dateDay)) {
        const attendance = attendanceMap.get(dateDay);
        dayData.arrival = attendance.arrival;
        dayData.departure = attendance.departure;
  
        // Вычисляем продолжительность рабочего дня (в часах)
        // Пример: преобразуем строки времени в минуты от начала дня
        // if (attendance.arrival && attendance.departure) {
        //   const arrivalMinutes = parseTimeToMinutes(attendance.arrival);
        //   const departureMinutes = parseTimeToMinutes(attendance.departure);
        //   const durationMinutes = departureMinutes - arrivalMinutes;
      
        //   const hours = Math.floor(durationMinutes / 60);
        //   const minutes = durationMinutes % 60;
        //   dayData.workDuration = `${hours}h ${minutes}m`;
        // }
      }
  
      // Проверяем есть ли день в личном календаре пользователя
      if (calendarMap.has(dateDay)) {
        const calendarItem = calendarMap.get(dateDay);
  
        dayData.isWorkingDay = true;
        dayData.dayStatus = "workday"
        dayData.shift = calendarItem.shift;
        dayData.status = calendarItem.status;
      }
  
      console.log(dayData);
    }
  
    return "da"
  } catch (error) {
    console.error(error);
  }
};

let result = processData(
  workerData.year,
  workerData.month,
  workerData.calendar,
  workerData.absences,
  workerData.holidays,
  workerData.events
);

parentPort.postMessage(result)