import { ONE_WEEK } from "./variables";
import { listReservationsQuery_listReservations_results } from "../__generated__/listReservationsQuery";

class Day {
  date: Date;
  reservations: listReservationsQuery_listReservations_results[];
  timezones: [];
  constructor(
    date: Date,
    reservations: listReservationsQuery_listReservations_results[] = [],
    timezones = []
  ) {
    this.date = date;
    this.reservations = reservations;
    this.timezones = [];
  }
}

export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export const getYMD = (
  inputDate: string | Date,
  option: "yyyymmdd" | "yymmdd",
  separator?: "-"
) => {
  const localDate = new Date(inputDate);
  let year;
  if (option === "yymmdd") year = String(localDate.getFullYear()).substring(2);
  if (option === "yyyymmdd") year = String(localDate.getFullYear());
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const date = String(localDate.getDate()).padStart(2, "0");
  if (separator) return `${year}-${month}-${date}`;
  return `${year}${month}${date}`;
};

export function getHHMM(inputDate: string | Date, seperator?: ":") {
  const date = new Date(inputDate);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  if (seperator === ":") return `${hh}:${mm}`;
  return `${hh}${mm}`;
}

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
    const day = new Day(loopDate);
    weeks.push(day);
  }
  return weeks;
};

export function getDateOfMonth(value: Date) {
  let result = [];
  const firstDate = new Date(value);
  const lastDate = new Date(firstDate);
  firstDate.setDate(1);
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(0);
  for (let i = 1; i <= lastDate.getDate(); i++) {
    const date = new Date(firstDate);
    date.setDate(+i);
    result.push(date);
  }
  return result;
}

export function compareDateMatch(
  inputDate: Date,
  comparisonDate: Date
): boolean {
  return (
    inputDate.getFullYear() === comparisonDate.getFullYear() &&
    inputDate.getMonth() === comparisonDate.getMonth() &&
    inputDate.getDate() === comparisonDate.getDate()
  );
}
