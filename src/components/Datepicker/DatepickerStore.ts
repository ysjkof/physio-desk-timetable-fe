import { createContext } from 'react';
import type { CalendarDate } from '../../models/CalendarDate';

export const DatepickerContext = createContext<{
  month: CalendarDate[];
  getYearMonth: () => string;
  setPreviousMonth: () => void;
  setNextMonth: () => void;
}>({
  month: [],
  getYearMonth() {
    return '';
  },
  setNextMonth() {},
  setPreviousMonth() {},
});
