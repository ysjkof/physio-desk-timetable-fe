import { getDate, isSameMonth, isSaturday, isSunday, isToday } from 'date-fns';

export class CalendarDate {
  #date: Date;

  #selectMonth: Date;

  constructor(date: Date, selectMonth: Date) {
    this.#date = date;
    this.#selectMonth = selectMonth;
  }

  getDate() {
    return this.#date;
  }

  getDay() {
    return getDate(this.#date);
  }

  isToday() {
    return isToday(this.#date);
  }

  isSunday() {
    return isSunday(this.#date);
  }

  isSaturday() {
    return isSaturday(this.#date);
  }

  isThisMonth() {
    return isSameMonth(this.#date, this.#selectMonth);
  }
}
