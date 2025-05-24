import { parentPort, workerData } from "worker_threads";

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

const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Функция для создания Map из массива absence
const createAbsenceMap = (absences) => {
  const absenceMap = new Map();

  absences.forEach(absence => {
    const start = new Date(absence.start);
    const end = new Date(absence.end);

    if (!start || !end || start > end) {
      console.warn(`Invalid date range for absence ID ${absence._id}`);
      return;
    }

    // Получаем все даты в диапазоне
    const dateRange = getDateRange(start, end);

    // Для каждой даты добавляем запись в Map
    dateRange.forEach(date => {
      const day = date.getDate(); // Получаем день месяца (например, 20 для 20 мая)
      absenceMap.set(day, absence); // Ключ — день, значение — объект absence
    });
  });

  return absenceMap;
};

const reorderEventsWithFirstAndLast = (events) => {
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
}

const processData = async (year, month, calendar, absences, holidays, events) => {
  try {
    const calendarMap = new Map(calendar.map(item => [item.date.getDate(), item]));
    const holidayMap = new Map(holidays.map(item => [item.date.getDate(), item]));
    const absenceMap = createAbsenceMap(absences);
  
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
      let calendarId = calendarMap.get(dateDay)?.id || null;
  
      let dayData = {
        calendarId,
        day,
        reason: null,
        dayStatus: "weekend",
        isWorkingDay: false,
        attended: false,
        shift: 'off',
        status: 'planned',
        arrival: null,
        departure: null,
        events: [],
        workDuration: 0,
      };
  
      // Проверяем есть ли день в личном календаре пользователя
      if (absenceMap.has(dateDay) || holidayMap.has(dateDay)) {
        
        if (absenceMap.has(dateDay)) {
          const absence = absenceMap.get(dateDay);
          dayData.reason = absence.reason.title;
          dayData.dayStatus = "absence";
          dayData.events = [];
        }
  
        if (holidayMap.has(dateDay)) {
          const holiday = holidayMap.get(dateDay);
          dayData.reason = holiday.title;
          dayData.dayStatus = "holiday";
          dayData.events = [];
          dayData.isWorkingDay = false;
        }
      } else {
        if (calendarMap.has(dateDay)) {
          const calendarItem = calendarMap.get(dateDay);
          const attendance = attendanceMap.get(dateDay);
  
          // Добавляем информацию о времени прихода и ухода
          dayData.arrival = attendance?.arrival || null;
          dayData.departure = attendance?.departure || null;
    
          // Вычисляем продолжительность рабочего дня (в часах)
          if (dayData.arrival && dayData.departure) {
            dayData.workDuration = calculateWorkDuration(eventsMap.get(dateDay) || []);
          }
    
          dayData.events = reorderEventsWithFirstAndLast(eventsMap.get(dateDay) || []);;
          dayData.isWorkingDay = true;
          dayData.attended = true;
          dayData.dayStatus = "workday"
          dayData.shift = calendarItem.shift;
          dayData.status = calendarItem.status;
        }
        // else {
        //   dayData.isWorkingDay = true;
        //   dayData.attended = false;
        //   dayData.dayStatus = "workday";
        // }
      }

      result.push(dayData);
    }

    return result;
  } catch (error) {
    console.error("Error in processData:", error);
    throw error;
  }
};

try {
  let result = await processData(
    workerData.year,
    workerData.month,
    workerData.calendar,
    workerData.absences,
    workerData.holidays,
    workerData.events
  );

  parentPort.postMessage(result);
} catch (error) {
  parentPort.postMessage({ error: error.message });
}