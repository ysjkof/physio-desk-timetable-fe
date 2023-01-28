import { createContext } from 'react';
import type { CalendarDate } from '../../models/CalendarDate';
import type { CloseAction } from '../../types/props.types';

interface DatepickerContextProps extends CloseAction {
  month: CalendarDate[];
  getYearMonth: () => string;
  setPreviousMonth: () => void;
  setNextMonth: () => void;
  setDate: (date: Date) => void;
}

export const DatepickerContext = createContext<DatepickerContextProps>({
  month: [],
  getYearMonth() {
    return '';
  },
  setNextMonth() {},
  setPreviousMonth() {},
  closeAction() {},
  setDate() {},
});
