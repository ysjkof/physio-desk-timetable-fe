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

const NUMBER_OF_A_WEEK = 7;
export const getThisWeeksDate = () => {
  const thisWeeks: {
    day: number;
    date: number;
    month: number;
    year: number;
    isToday: boolean;
    fulldate: Date;
  }[] = [];
  const now = new Date();
  const nowDate = now.getDate();
  const nowDay = now.getDay();
  const firstDate = new Date(now.setDate(nowDate - nowDay));
  for (let i = 0; i < NUMBER_OF_A_WEEK; i++) {
    let date = new Date(firstDate);
    date = new Date(date.setDate(date.getDate() + i));
    const dateObj = {
      day: i,
      date: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      isToday: nowDate === date.getDate() && true,
      fulldate: date,
    };
    thisWeeks.push(dateObj);
  }
  return thisWeeks;
};
