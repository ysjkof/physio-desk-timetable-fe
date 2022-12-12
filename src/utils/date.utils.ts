import {
  differenceInMinutes,
  intlFormat,
  parseISO,
  setDay,
  startOfDay,
} from 'date-fns';

export function getSunday(date: Date) {
  return startOfDay(setDay(date, 0));
}

export function getWeeks(dateOfSunday: Date) {
  const result: { date: Date }[] = [];
  for (let i = 0; i < 7; i += 1) {
    const sunday = new Date(dateOfSunday);
    sunday.setDate(sunday.getDate() + i);
    result.push({ date: sunday });
  }
  return result;
}

export function getYMD(
  inputDate: string | Date,
  option: 'yyyymmdd' | 'yymmdd' | 'mmdd',
  separator?: '-' | '/'
) {
  const localDate = new Date(inputDate);

  const yearGetObj = {
    mmdd: '',
    yymmdd: String(localDate.getFullYear()).substring(2),
    yyyymmdd: String(localDate.getFullYear()),
  };
  const year = yearGetObj[option];
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const date = String(localDate.getDate()).padStart(2, '0');

  if (!separator) return year ? `${year}${month}${date}` : `${month}${date}`;

  return year
    ? `${year}${separator}${month}${separator}${date}`
    : `${month}${separator}${date}`;
}

/**
 * 다음 형태로 시각 반환한다. 다음: 오전 11:38
 * @param date
 * @returns
 */
export function getTimeString(date: Date, prefix?: boolean) {
  return intlFormat(date, {
    hour: '2-digit',
    hour12: !!prefix,
    minute: '2-digit',
  });
}

export function getDateOfNumeric(date: Date) {
  return intlFormat(date, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
  });
}

export function getDateOfString(date: Date) {
  return intlFormat(date, {
    year: 'numeric',
    month: 'long',
  });
}

export function getDateAndDifference(start: string, end: string) {
  const startDate = parseISO(start);
  const date = getDateOfNumeric(startDate);
  const difference = differenceInMinutes(parseISO(end), startDate);
  return `${date} (${difference}분)`;
}

export function addHourToDate(fromDate: Date, hours: Date) {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();
  const date = fromDate.getDate();
  const hour = hours.getHours();
  const minute = hours.getMinutes();

  return new Date(year, month, date, hour, minute);
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

export function getWeeksOfMonth(referenceDay: Date) {
  const result = [];
  const firstDate = new Date(referenceDay);
  const lastDate = new Date(firstDate);
  firstDate.setDate(1);
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(0);
  for (let i = 0; i < 6; i += 1) {
    const date = new Date(firstDate);
    date.setDate(i * 7 + 1);
    const week = getWeeks(getSunday(date));
    result.push(...week);
    if (
      firstDate.getMonth() !== week[6].date.getMonth() ||
      (i > 0 && firstDate.getMonth() !== week[0].date.getMonth())
    )
      break;
  }
  return result;
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

export function compareSameWeek(date: Date, secondDate: Date): boolean {
  return compareDateMatch(getSunday(date), getSunday(secondDate), 'ymd');
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

/**
 * Date를 받고 그 달의 첫날짜와 끝날짜를 반환한다
 * @param {Date} date
 * @returns [startDate, endDate]
 */
export function getMonthStartEnd(date: Date): [Date, Date] {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  startDate.setDate(1);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);
  return [startDate, endDate];
}

interface Duration {
  hour: number;
  minute: number;
}

/**
 * param1의 Date객체의 시, 분과 param2 객체의 시, 분을 비교해 Boolean을 반환한다
 */
export function compareTableEndtime(date: Date, { hour, minute }: Duration) {
  const hourToCompare = date.getHours();
  const minuteToCompare = date.getMinutes();
  return hourToCompare === hour && minuteToCompare === minute;
}

export function getDateFromYMDHM(
  startDateYear: number,
  startDateMonth: number,
  startDateDate: number,
  startDateHours?: number,
  startDateMinutes?: number
) {
  const month = String(startDateMonth).padStart(2, '0');
  const day = String(startDateDate).padStart(2, '0');
  const ymd = `${startDateYear}-${month}-${day}`;
  let hms = `T00:00:00.000`;

  if (
    typeof startDateHours === 'number' &&
    typeof startDateMinutes === 'number'
  ) {
    const hours = String(startDateHours).padStart(2, '0');
    const minutes = String(startDateMinutes).padStart(2, '0');
    hms = `T${hours}:${minutes}:00.000`;
  }
  return new Date(ymd + hms);
}

export function getHowManyDayFromMillisecond(millisecond: number) {
  // MILLISECOND_TO_DAY = 1000 / 60 / 60 / 24
  return millisecond / 1000 / 60 / 60 / 24;
}

/** date가 속한 주의 요일 인덱스에 맞는 날짜를 반환 */
export function createDateFromDay(date: Date, dayIdx: number) {
  const newDate = new Date(date);
  const dayGap = dayIdx - newDate.getDay();
  newDate.setDate(newDate.getDate() + dayGap);
  return newDate;
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

export function isPastDate(dateToCheck: Date, referenceDate: Date) {
  return dateToCheck.getTime() < referenceDate.getTime();
}
