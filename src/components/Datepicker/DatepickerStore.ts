import { createContext } from 'react';
import type { CalendarDate } from '../../models/CalendarDate';

export const DatepickerContext = createContext<{
  month: CalendarDate[];
  getYearMonth: () => string;
  setPreviousMonth: () => void;
  setNextMonth: () => void;
  closeAction: () => void;
  setDate: (date: Date) => void;
}>({
  month: [],
  getYearMonth() {
    return '';
  },
  setNextMonth() {},
  setPreviousMonth() {},
  closeAction() {},
  setDate() {},
});
