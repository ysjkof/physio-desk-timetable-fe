import {
  addMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { getStringOfDate } from '../utils/dateUtils';
import { CalendarDate } from './CalendarDate';

export class Calendar {
  month: CalendarDate[];

  constructor(date: Date) {
    this.month = this.#getCalendarDateOfMonth(date);
  }

  #getCalendarDateOfMonth(date: Date) {
    const getSundaysOfMonth = (date: Date) => {
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      return eachWeekOfInterval({ start, end });
    };
    const sundayOfWeeks = getSundaysOfMonth(date);
    const startOfFirstWeek = sundayOfWeeks[0];
    const endOfLastWeek = endOfWeek(sundayOfWeeks[sundayOfWeeks.length - 1]);

    return eachDayOfInterval({
      start: startOfFirstWeek,
      end: endOfLastWeek,
    }).map((standardDate) => new CalendarDate(standardDate, date));
  }

  #setMonth(date: Date) {
    const weeksOfMonth = this.#getCalendarDateOfMonth(date);
    this.month = weeksOfMonth;
  }

  #getReferenceDate() {
    return this.month[10].getDate();
  }

  toStringYearMonth() {
    return getStringOfDate(this.#getReferenceDate());
  }

  setToNextMonth() {
    const nextMonth = addMonths(this.#getReferenceDate(), 1);
    this.#setMonth(nextMonth);
    return this;
  }

  setToPreviousMonth() {
    const nextMonth = subMonths(this.#getReferenceDate(), 1);
    this.#setMonth(nextMonth);
    return this;
  }
}
