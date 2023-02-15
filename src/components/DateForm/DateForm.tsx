import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cls } from '../../utils/commonUtils';
import Datepicker from '../Datepicker';
import Timepicker from '../Timepicker';
import { InputForDateForm } from './InputForDateForm';
import type { HoursAndMinutes } from '../../types/commonTypes';

interface DateFormFields {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

interface DateFormProps {
  date?: Date;
  hasHour?: boolean;
  disablePreviousDay?: boolean;
  setParentValue: (date: Date) => void;
}

export const DateForm = ({
  date,
  hasHour = false,
  disablePreviousDay,
  setParentValue,
}: DateFormProps) => {
  const { register, setValue, getValues } = useForm<DateFormFields>();

  const [hasDatepicker, setHasDatepicker] = useState(false);
  const [hasTimepicker, setHasTimepicker] = useState(false);

  const closeDatepicker = () => {
    setHasDatepicker(false);
  };
  const openDatepicker = () => {
    closeTimepicker();
    setHasDatepicker(true);
  };
  const closeTimepicker = () => {
    setHasTimepicker(false);
  };
  const openTimepicker = () => {
    closeDatepicker();
    setHasTimepicker(true);
  };

  const setDate = (date: Date) => {
    setValue('year', date.getFullYear());
    setValue('month', date.getMonth() + 1);
    setValue('day', date.getDate());
    setParentDate();
  };

  const setTime = ({ hours, minutes }: HoursAndMinutes) => {
    if (typeof hours === 'number') setValue('hours', hours);
    if (typeof minutes === 'number') setValue('minutes', minutes);
    setParentDate();
  };

  const setParentDate = () => {
    const { year, month, day, hours, minutes } = getValues();
    const startDate = new Date(
      `${year}-${month}-${day}T${hours}:${minutes}:00`
    );
    setParentValue(startDate);
  };

  const setDateTime = (date: Date) => {
    setValue('year', date.getFullYear());
    setValue('month', date.getMonth() + 1);
    setValue('day', date.getDate());
    setValue('hours', date.getHours());
    setValue('minutes', date.getMinutes());
  };

  useEffect(() => {
    if (!date) return;
    setDateTime(date);
  }, [date]);

  return (
    <div
      className={cls(
        'relative grid w-full gap-1',
        hasHour
          ? 'grid-cols-[1fr_repeat(4,_0.7fr)]'
          : 'grid-cols-[1fr_repeat(2,_0.7fr)]'
      )}
      onBlur={setParentDate}
    >
      <InputForDateForm
        label="년"
        register={register('year')}
        className="date-form__input"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="월"
        register={register('month')}
        className="date-form__input"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="일"
        register={register('day')}
        className="date-form__input"
        onFocus={openDatepicker}
      />
      {hasHour && (
        <>
          <InputForDateForm
            label="시"
            register={register('hours')}
            className="date-form__input"
            onFocus={openTimepicker}
            minLength={1}
            maxLength={2}
          />
          <InputForDateForm
            label="분"
            register={register('minutes', { minLength: 2, maxLength: 2 })}
            className="date-form__input"
            onFocus={openTimepicker}
            minLength={1}
            maxLength={2}
            step={10}
          />
        </>
      )}
      {hasDatepicker && (
        <div className="absolute left-0 top-8 z-10 bg-white">
          <Datepicker
            closeAction={closeDatepicker}
            selectedDate={date || new Date()}
            selectDate={setDate}
            disablePreviousDay={disablePreviousDay}
          />
        </div>
      )}
      {hasTimepicker && (
        <div className="absolute right-0 top-8 z-10 bg-white">
          <Timepicker closeAction={closeTimepicker} setTime={setTime} />
        </div>
      )}
    </div>
  );
};
