import { ONE_WEEK } from "../constants";
import { Day } from "../pages/user/time-table";

export const getYMD = (
  inputDate: string | Date,
  option: "yyyymmdd" | "yymmdd",
  separator?: "-"
) => {
  const localDate = new Date(inputDate);
  let year;
  if (option === "yymmdd") {
    year = String(localDate.getFullYear()).substring(2);
  }
  if (option === "yyyymmdd") {
    year = String(localDate.getFullYear());
  }
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const date = String(localDate.getDate()).padStart(2, "0");
  if (separator) {
    return `${year}-${month}-${date}`;
  }
  return `${year}${month}${date}`;
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
  const weeks = [];
  const newDate = new Date(date);
  const inputDate = newDate.getDate();
  const inputDay = newDate.getDay();
  const firstDate = new Date(newDate.setDate(inputDate - inputDay));
  for (let i = 0; i < ONE_WEEK; i++) {
    let loopDate = new Date(firstDate);
    loopDate = new Date(loopDate.setDate(loopDate.getDate() + i));
    const day = new Day(loopDate, []);
    weeks.push(day);
  }
  return weeks;
};
