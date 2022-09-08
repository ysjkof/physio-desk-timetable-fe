export const getSunday = (date: Date) => {
  const returnDate = new Date(date);
  returnDate.setHours(0, 0, 0, 0);
  returnDate.setDate(date.getDate() - date.getDay());
  return returnDate;
};

export function getAfterDate(startDate: Date, afterDay: number) {
  const returnDate = new Date(startDate);
  returnDate.setHours(0, 0, 0, 0);
  returnDate.setDate(startDate.getDate() + afterDay);
  return returnDate;
}

export const getWeeks = (dateOfSunday: Date) => {
  let result: { date: Date }[] = [];
  for (let i = 0; i < 7; i++) {
    const sunday = new Date(dateOfSunday);
    sunday.setDate(sunday.getDate() + i);
    result.push({ date: sunday });
  }
  return result;
};

export const getYMD = (
  inputDate: string | Date,
  option: 'yyyymmdd' | 'yymmdd' | 'mmdd',
  separator?: '-' | '/'
) => {
  const localDate = new Date(inputDate);
  let year = '';
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const date = String(localDate.getDate()).padStart(2, '0');
  switch (option) {
    case 'mmdd':
      break;
    case 'yymmdd':
      year = String(localDate.getFullYear()).substring(2);
      break;
    case 'yyyymmdd':
      year = String(localDate.getFullYear());
      break;
  }
  if (separator)
    return year
      ? `${year}${separator}${month}${separator}${date}`
      : `${month}${separator}${date}`;
  return year ? `${year ?? ''}${month}${date}` : `${month}${date}`;
};

export function getHHMM(inputDate: string | Date, seperator?: ':') {
  const date = new Date(inputDate);
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  if (seperator === ':') return `${hh}:${mm}`;
  return `${hh}${mm}`;
}

export function addHourToDate(fromDate: Date, hours: Date) {
  const year = fromDate.getFullYear();
  const month = fromDate.getMonth();
  const date = fromDate.getDate();
  const hour = hours.getHours();
  const minute = hours.getMinutes();

  return new Date(year, month, date, hour, minute);
}

export const getTimeLength = (
  startDate: Date,
  endDate: Date,
  unit: 'minute' | '20minute'
) => {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  let seconds = 60;
  let minutes = 1;

  switch (unit) {
    case 'minute':
      break;
    case '20minute': // 시간표 한 칸의 최소 높이가 10분 20px이라서 한 번에 구하기 위함
      minutes = 10;
      break;
  }
  return (ed.getTime() - sd.getTime()) / 1000 / seconds / minutes;
};

export const getWeeksOfMonth = (date: Date) => {
  let result = [];
  const firstDate = new Date(date);
  const lastDate = new Date(firstDate);
  firstDate.setDate(1);
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(0);
  for (let i = 0; i < 6; i++) {
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
};

export const compareDateMatch = (
  inputDate: Date,
  comparisonDate: Date,
  option: 'ymd' | 'ym' | 'd' | 'hm'
): boolean => {
  switch (option) {
    case 'ymd':
      return (
        inputDate.getDate() === comparisonDate.getDate() &&
        inputDate.getMonth() === comparisonDate.getMonth() &&
        inputDate.getFullYear() === comparisonDate.getFullYear()
      );
    case 'ym':
      return (
        inputDate.getMonth() === comparisonDate.getMonth() &&
        inputDate.getFullYear() === comparisonDate.getFullYear()
      );
    case 'd':
      return inputDate.getDate() === comparisonDate.getDate();
    case 'hm':
      return (
        inputDate.getMinutes() === comparisonDate.getMinutes() &&
        inputDate.getHours() === comparisonDate.getHours()
      );
  }
};

export const compareSameWeek = (date: Date, secondDate: Date): boolean => {
  return compareDateMatch(getSunday(date), getSunday(secondDate), 'ymd');
};

export const newDateSetHourAndMinute = ({
  hour,
  minute,
  fromDate,
}: {
  hour: number;
  minute: number;
  fromDate?: Date;
}) => {
  const date = fromDate ? fromDate : new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
};
// 시작시각부터 끝시각까지 timeGap의 차이가 나는 Date배열을 만든다
export function getTimeGaps(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number,
  timeGap: number
): Date[] {
  const labels = [];
  const start = newDateSetHourAndMinute({
    hour: startHours,
    minute: startMinutes,
  });
  const end = newDateSetHourAndMinute({ hour: endHours, minute: endMinutes });

  let i = 0;
  while (i < 1500) {
    const date = new Date(start);
    const labelRow = date;
    labels.push(labelRow);
    const getMinutes = start.getMinutes();
    start.setMinutes(getMinutes + timeGap);
    i++;
    if (start.valueOf() > end.valueOf()) i = 1500;
  }

  return labels;
}

export const get4DigitHour = (date: Date | string) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return (
    (date.getHours() + '').padStart(2, '0') +
    ':' +
    (date.getMinutes() + '').padStart(2, '0')
  );
};

export const getFrom4DigitTime = (time: string, what: 'hour' | 'minute') =>
  what === 'hour' ? +time.substring(0, 2) : time.substring(3, 5);

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
  const MM = String(startDateMonth).padStart(2, '0');
  const DD = String(startDateDate).padStart(2, '0');
  const ymd = `${startDateYear}-${MM}-${DD}`;
  let hms = `T00:00:00.000`;
  if (
    typeof startDateHours === 'number' &&
    typeof startDateMinutes === 'number'
  ) {
    const HH = String(startDateHours).padStart(2, '0');
    const MM = String(startDateMinutes).padStart(2, '0');
    hms = `T${HH}:${MM}:00.000`;
  }
  return new Date(ymd + hms);
}

export function getHowManyDayFromMillisec(millisecond: number) {
  // MILLISECOND_TO_DAY = 1000 / 60 / 60 / 24
  return millisecond / 1000 / 60 / 60 / 24;
}

/** date가 속한 주의 요일 인덱스에 맞는 날짜를 반환*/
export const createDateFromDay = (date: Date, dayIdx: number) => {
  const newDate = new Date(date);
  const dayGap = dayIdx - newDate.getDay();
  newDate.setDate(newDate.getDate() + dayGap);
  return newDate;
};

/** 새 날짜를 생성하면서 시, 분, 초, 밀리초를 초기화 한다. 초와 밀리초는 무조건 0이다. */
export const createDate = (
  date: string | Date,
  option?: { hour?: number; minute?: number }
) => {
  const newDate = date ? new Date(date) : new Date();
  if (option) {
    const { hour, minute } = option;
    if (hour && minute) {
      newDate.setHours(hour, minute);
    } else if (minute) {
      newDate.setMinutes(minute);
    }
    newDate.setSeconds(0, 0);
  } else {
    newDate.setMinutes(0, 0, 0);
  }
  return newDate;
};

export function getHoursByUnit(start: number, end: number) {
  const hours = [];
  let i = start;
  while (i < end) {
    hours.push(i);
    i++;
  }
  return hours;
}

export function getMinutesByUnit(minutesUnit: number) {
  const minutes = [];
  let i = 0;
  while (i < 60) {
    minutes.push(i);
    i = i + minutesUnit;
  }
  return minutes;
}
