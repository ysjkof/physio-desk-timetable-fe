import {
  differenceInMinutes,
  endOfDay,
  isToday,
  isYesterday,
  lastDayOfMonth,
  lastDayOfWeek,
  parseISO,
  setDay,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import { LOCALE } from '../constants/constants';
import { TwoDate } from '../types/commonTypes';

export function getSunday(date: Date) {
  return startOfDay(setDay(date, 0));
}

function convertDateFromString(date: string | Date) {
  return date instanceof Date ? date : new Date(date);
}
export function getStringOfTimeOrDate(
  date: Date | string,
  hasWeekday?: boolean
) {
  date = convertDateFromString(date);
  if (isToday(date)) return getStringOfTime(date);
  if (isYesterday(date)) return '어제';
  return getStringYearMonthDay(date);
}

export function getStringOfDateOrTodayYesterday(date: Date | string) {
  date = convertDateFromString(date);
  const weekday = getStringWeekDay(date, 'short');
  if (isToday(date)) return `오늘 (${weekday})`;
  if (isYesterday(date)) return `어제 (${weekday})`;
  return `${getStringYearMonthDay(date)} (${weekday})`;
}

/**
 * 다음 형태로 시각 반환한다. 다음: 오전 11:38
 * @param date
 * @returns
 */
export function getStringOfTime(date: Date | string, prefix?: boolean) {
  date = convertDateFromString(date);
  return new Intl.DateTimeFormat(LOCALE, {
    hour: '2-digit',
    hour12: !!prefix,
    minute: '2-digit',
  }).format(date);
}

export function getStringOfDateTime(date: Date | string) {
  date = convertDateFromString(date);
  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
}

export function getStringYearMonthDay(date: Date) {
  date = convertDateFromString(date);
  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function getStringYearMonthDayWeekday(date: Date) {
  date = convertDateFromString(date);
  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).format(date);
}

export function getStringYear(date: Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
  }).format(date);
}

export function getStringYearMonth(date: Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
  }).format(date);
}

export function getStringMonthDay(date: Date) {
  return new Intl.DateTimeFormat(LOCALE, {
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getStringDay(date: Date) {
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric' }).format(date);
}

export function getStringWeekDay(date: Date, type: 'short' | 'long' = 'long') {
  return new Intl.DateTimeFormat(LOCALE, { weekday: type }).format(date);
}

export function getDateAndDifference(start: string, end: string) {
  const startDate = parseISO(start);
  const date = getStringOfDateTime(startDate);
  const difference = differenceInMinutes(parseISO(end), startDate);
  return `${date} (${difference}분)`;
}

export function getTimeLength(
  startDate: Date,
  endDate: Date,
  unit: 'minute' | '20minute'
) {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  const seconds = 60;
  const minuteHeight = {
    minute: 1,
    '20minute': 10, // 시간표 한 칸의 최소 높이가 10분 20px이라서 한 번에 구하기 위함
  };
  const minutes = minuteHeight[unit];

  return (ed.getTime() - sd.getTime()) / 1000 / seconds / minutes;
}

export function compareDateMatch(
  inputDate: Date,
  comparisonDate: Date,
  option: 'ymd' | 'ym' | 'd' | 'hm'
): boolean {
  const options = {
    ymd() {
      return (
        inputDate.getDate() === comparisonDate.getDate() &&
        inputDate.getMonth() === comparisonDate.getMonth() &&
        inputDate.getFullYear() === comparisonDate.getFullYear()
      );
    },
    ym() {
      return (
        inputDate.getMonth() === comparisonDate.getMonth() &&
        inputDate.getFullYear() === comparisonDate.getFullYear()
      );
    },
    d() {
      return inputDate.getDate() === comparisonDate.getDate();
    },
    hm() {
      return (
        inputDate.getMinutes() === comparisonDate.getMinutes() &&
        inputDate.getHours() === comparisonDate.getHours()
      );
    },
  };
  return options[option]();
}

export function get4DigitHour(date: Date | string) {
  const referenceDate = typeof date === 'string' ? new Date(date) : date;
  const hour = String(referenceDate.getHours()).padStart(2, '0');
  const minute = String(referenceDate.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

export function getFrom4DigitTime(time: string, what: 'hour' | 'minute') {
  return what === 'hour' ? time.substring(0, 2) : time.substring(3, 5);
}

/** 새 날짜를 생성하면서 시, 분, 초, 밀리초를 초기화 한다. 초와 밀리초는 무조건 0이다. */
export function createDate(
  date?: string | Date,
  option?: { hour: number; minute: number }
) {
  const newDate = date ? new Date(date) : new Date();
  if (option) {
    const { hour, minute } = option;
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  }
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function getHoursByUnit(start: number, end: number) {
  const hours = [];
  let i = start;
  while (i < end) {
    hours.push(i);
    i += 1;
  }
  return hours;
}

export function getMinutesByUnit(minutesUnit: number) {
  const minutes = [];
  let i = 0;
  while (i < 60) {
    minutes.push(i);
    i += minutesUnit;
  }
  return minutes;
}

export function convertMinuteFromDate(date: Date) {
  return date.getTime() / 1000 / 60;
}

export function isBeforeDateB(dateA: Date, dateB: Date) {
  return dateA.getTime() >= dateB.getTime();
}

export function isValidDateFrom8Digit(dateString: string) {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Check the number of days in the month
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    return false;
  }

  return true;
}

export function getDateFromStr8Digit(dateString: string) {
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10) - 1;
  const day = parseInt(dateString.substring(6, 8), 10);
  return new Date(year, month, day);
}

export const isValidMonth = (month: number) =>
  Number.isInteger(+month) && month > 0 && month < 13;

export const isValidDay = (date: Date, day: number) => {
  const lastDay = lastDayOfMonth(date).getDate();
  if (day > lastDay) return false;
  return true;
};

export const startAndLastOfThisWeek = (): TwoDate => {
  const today = new Date();
  return [startOfWeek(today), lastDayOfWeek(today)];
};

export const startAndLastOfDay = (date: Date): TwoDate => [
  startOfDay(date),
  endOfDay(date),
];
