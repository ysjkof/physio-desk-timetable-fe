import { ONE_WEEK } from "../constants";
import { ITableViewDate } from "../pages/user/time-table";

export const getYYMMDD = (inputDate: string | Date, option?: boolean) => {
  const localDate = new Date(inputDate);
  const yy = String(localDate.getFullYear()).substring(2);
  const mm = String(localDate.getMonth() + 1).padStart(2, "0");
  const dd = String(localDate.getDate()).padStart(2, "0");
  if (option) {
    return `${yy}-${mm}-${dd}`;
  }
  return `${yy}${mm}${dd}`;
};

export const getHHMM = (inputDate: string | Date, option?: boolean) => {
  const localDate = new Date(inputDate);
  const hh = String(localDate.getHours()).padStart(2, "0");
  const mm = String(localDate.getMinutes()).padStart(2, "0");
  if (option) {
    return `${hh}:${mm}`;
  }
  return `${hh}${mm}`;
};

export const getTimeLength = (startDate: Date, endDate: Date) => {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  return (ed.getTime() - sd.getTime()) / 1000 / 60;
};

export const getWeeksDate = (date: Date) => {
  const thisWeeks: ITableViewDate[] = [];
  const newDate = new Date(date);
  const inputDate = newDate.getDate();
  const inputDay = newDate.getDay();
  const firstDate = new Date(newDate.setDate(inputDate - inputDay));
  for (let i = 0; i < ONE_WEEK; i++) {
    let loopDate = new Date(firstDate);
    loopDate = new Date(loopDate.setDate(loopDate.getDate() + i));
    const dateObj = {
      day: i,
      date: loopDate.getDate(),
      month: loopDate.getMonth() + 1,
      year: loopDate.getFullYear(),
      isToday: inputDate === loopDate.getDate() && true,
      fulldate: loopDate,
    };
    thisWeeks.push(dateObj);
  }
  return thisWeeks;
};
