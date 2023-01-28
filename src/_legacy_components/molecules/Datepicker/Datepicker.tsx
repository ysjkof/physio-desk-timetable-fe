import { useEffect, useState } from 'react';
import {
  DatepickerWithInputProps,
  InputDate,
} from '../../../types/datepicker.types';
import { DatepickerCalendar } from './DatepickerCalendar';
import { DatepickerInput } from './DatepickerInput';

// TODO: 완전 새로 만들어야해
export default function Datepicker({
  setSelectedDate,
  defaultDate,
  textColor,
  hasHour = false,
}: DatepickerWithInputProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const [inputDate, setInputDate] = useState<InputDate>(
    defaultDate
      ? {
          year: `${defaultDate.getFullYear()}`,
          month: `${defaultDate.getMonth() + 1}`,
          day: `${defaultDate.getDate()}`,
          hour: `${defaultDate.getHours()}`,
          minute: `${defaultDate.getMinutes()}`,
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
