import { useEffect, useState } from 'react';
import DatepickerCalendar from './DatepickerCalendar';
import DatepickerInput from './DatepickerInput';

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
interface IDatepickerWithInputProps extends HasDateOption {
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  defaultDate?: Date;
  textColor?: string;
}

export default function Datepicker({
  setSelectedDate,
  defaultDate,
  textColor,
  hasHour = false,
}: IDatepickerWithInputProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const [inputDate, setInputDate] = useState<InputDate>(
    defaultDate
      ? {
          year: '' + defaultDate.getFullYear(),
          month: '' + (defaultDate.getMonth() + 1),
          day: '' + defaultDate.getDate(),
          hour: '' + defaultDate.getHours(),
          minute: '' + defaultDate.getMinutes(),
        }
      : {
          year: '',
          month: '',
          day: '',
          hour: '',
          minute: '',
        }
  );

  useEffect(() => {
    const { year, month, day, hour, minute } = inputDate;
    setSelectedDate(
      new Date(`${year}-${month}-${day} ${hour || 0}:${minute || 0}`)
    );
  }, [inputDate]);

  return (
    <div className="datepicker flex w-full items-center gap-1">
      <DatepickerCalendar
        inputDate={inputDate}
        setInputDate={setInputDate}
        isOpen={open}
        setOpen={setOpen}
        hasHour={hasHour}
      />
      <DatepickerInput
        inputDate={inputDate}
        setInputDate={setInputDate}
        textColor={textColor}
        hasHour={hasHour}
        error={error}
        setError={setError}
      />
    </div>
  );
}
