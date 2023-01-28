// 할일: 리펙토링 후 제거

import { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export interface HasDateOption {
  hasHour?: boolean;
}
export interface DatepickerErrorState {
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}
export interface InputDate {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
}
export interface DatepickerInputState {
  inputDate: InputDate;
  setInputDate: React.Dispatch<React.SetStateAction<InputDate>>;
}
export interface DatepickerWithInputProps extends HasDateOption {
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultDate?: Date | null;
  textColor?: string;
}
type Time = '시' | '분';
export interface TimeSelectorProps extends DatepickerInputState {
  type: Time;
  numbers: number[];
  closeDatepicker: () => void;
}
export interface DatePickerInterface
  extends HasDateOption,
    DatepickerInputState {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

//

interface Attributes
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    PropsWithChildren {
  inactivate?: boolean;
}

export interface DatepickerCalendarButtonsProps {
  attributes: Attributes[];
}

export interface DayProps {
  day: number;
  isSunday: boolean;
  isSaturday: boolean;
  isThisMonth: boolean;
  isToday: boolean;
  isSelect: boolean;
  inactivate: boolean;
  onClick: () => void;
}
