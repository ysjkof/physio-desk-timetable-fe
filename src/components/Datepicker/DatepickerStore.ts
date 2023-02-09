import { createContext } from 'react';
import type { CalendarDate } from '../../models/CalendarDate';
import type { CloseAction } from '../../types/props.types';

interface DatepickerContextProps extends Partial<CloseAction> {
  month: CalendarDate[];
  getYearMonth: () => string;
  setPreviousMonth: () => void;
  setNextMonth: () => void;
  selectedDate: Date;
  selectDate: (date: Date) => void;
}

export const DatepickerContext = createContext<DatepickerContextProps>({
  month: [],
  getYearMonth() {
    return '';
  },
  setNextMonth() {},
  setPreviousMonth() {},
  closeAction: () => {},
  selectedDate: new Date(),
  selectDate() {},
});
