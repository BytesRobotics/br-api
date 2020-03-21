import NumberService from "./number.service";

function randomDate(startDate: Date, endDate: Date): Date {
  if (!startDate) {
    startDate = new Date(2010, 0, 1);
  }
  if (!endDate) {
    endDate = new Date();
  }

  return new Date(
    startDate.getTime() +
      NumberService.randomInt(endDate.getTime() - startDate.getTime())
  );
}

function getYearStart(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

function getYearEnd(date: Date): Date {
  return new Date(+new Date(date.getFullYear() + 1, 0, 1) - 1);
}

function getMonthBefore(amount: number): Date {
  const monthsBefore = new Date();
  monthsBefore.setMonth(monthsBefore.getMonth() - amount);
  return monthsBefore;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  const startOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  return new Date(+startOfNextMonth - 1);
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const startOfWeek1 = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.getFullYear(), date.getMonth(), startOfWeek1);
}

function endOfWeek(date: Date): Date {
  const nextWeek = new Date(date);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const startOfNextWeek = startOfWeek(nextWeek);
  return new Date(+startOfNextWeek - 1);
}

function getYearsBefore(amount: number): Date {
  return new Date(new Date().getFullYear() - amount, 0, 1);
}

function getWeekBefore(): Date {
  const weekBefore = new Date();
  weekBefore.setDate(weekBefore.getDate() - 7);
  return weekBefore;
}

const shortMonthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];
function getShortMonthName(monthIndex: number): string {
  return shortMonthsNames[monthIndex];
}

const shortWeekDayNames = ["Mon", "Tue", "Wen", "Thu", "Fri", "Sat", "Sun"];
function getShortWeekDay(dayIndex: number): string {
  return shortWeekDayNames[dayIndex - 1];
}

const addDays = (date: Date, days = 1) => {
  const copyDate = new Date(Number(date));

  copyDate.setDate(date.getDate() + days);

  return copyDate;
};

module.exports = {
  randomDate,
  getYearsBefore,
  getWeekBefore,
  getShortMonthName,
  getShortWeekDay,
  getYearStart,
  getYearEnd,
  getMonthBefore,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays
};
