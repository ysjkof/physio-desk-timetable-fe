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

export function combineYMDHM(YMDDate: Date, HMDate: Date) {
  const year = YMDDate.getFullYear();
  const month = YMDDate.getMonth();
  const date = YMDDate.getDate();
  const h = HMDate.getHours();
  const m = HMDate.getMinutes();

  return new Date(year, month, date, h, m);
}

export const getTimeLength = (
  startDate: Date,
  endDate: Date,
  unit: 'minute' | '20minute'
) => {
  const sd = new Date(startDate);
  const ed = new Date(endDate);
  let value = 60;
  switch (unit) {
    case 'minute':
      break;
    case '20minute': // 시간표 한 칸의 최소 높이가 10분 20px이라서 한 번에 구하기 위함
      value = 60 * 10;
      break;
  }
  return (ed.getTime() - sd.getTime()) / 1000 / value;
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

// 시작시각부터 끝시각까지 timeGap의 차이가 나는 Date배열을 만든다
export function getTimeGaps(
  startHours: number,
  startMinutes: number,
  endHours: number,
  endMinutes: number,
  timeGap: number
): Date[] {
  const labels = [];
  const start = new Date();
  const end = new Date(start);
  start.setHours(startHours, startMinutes, 0, 0);
  end.setHours(endHours, endMinutes, 0, 0);
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

export function getMonthStartEnd(date: Date) {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  startDate.setDate(1);
  endDate.setMonth(endDate.getMonth() + 1);
  endDate.setDate(0);
  endDate.setHours(23, 59, 59, 999);
  return [startDate, endDate];
}

interface duration {
  hours: number;
  minutes: number;
}
export function compareTableEndtime(date: Date, { hours, minutes }: duration) {
  const hour = date.getHours();
  const minute = date.getMinutes();
  return hour === hours && minute === minutes;
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
