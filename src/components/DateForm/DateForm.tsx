import { useEffect, useState } from 'react';
import { useForm, type UseFormSetValue } from 'react-hook-form';
import { cls } from '../../utils/common.utils';
import Datepicker from '../Datepicker';
import Timepicker from '../Timepicker';
import { InputForDateForm } from './InputForDateForm';
import type { HourAndMinute } from '../../types/common.types';
import type { FormOfReserveFields } from '../../types/form.types';

interface DateFormFields {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

interface DateFormProps {
  date: Date;
  hasHour?: boolean;
  setValue: UseFormSetValue<FormOfReserveFields>;
}

export const DateForm = ({
  date,
  hasHour = true,
  setValue: setValueOfParentInput,
}: DateFormProps) => {
  const { register, setValue } = useForm<DateFormFields>();

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
    setValueOfParentInput('date', date); // 시분 갱신해야됨
  };

  const setTime = ({ hour, minute }: HourAndMinute) => {
    if (hour) setValue('hour', hour);
    if (minute) setValue('minute', minute);
  };

  const setDateTime = (date: Date) => {
    setValue('year', date.getFullYear());
    setValue('month', date.getMonth() + 1);
    setValue('day', date.getDate());
    setValue('hour', date.getHours());
    setValue('minute', date.getMinutes());
  };

  useEffect(() => {
    if (!date) return;
    setDateTime(date);
  }, [date]);

  return (
    <div
      className={cls(
        'datepicker__input relative grid h-fit w-full gap-1',
        hasHour
          ? 'grid-cols-[1fr_repeat(4,_0.7fr)]'
          : 'grid-cols-[1fr_repeat(2,_0.7fr)]'
      )}
    >
      <InputForDateForm
        label="년"
        register={register('year')}
        className="w-full rounded-md border py-1 pr-5 text-right text-sm text-cst-blue shadow-sm transition-colors focus:border-cst-blue focus:outline-none focus:ring-1 focus:ring-cst-blue"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="월"
        register={register('month')}
        className="input-datepicker text-sm"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="일"
        register={register('day')}
        className="input-datepicker text-sm"
        onFocus={openDatepicker}
      />
      {hasHour && (
        <>
          <InputForDateForm
            label="시"
            register={register('hour')}
            className="input-datepicker text-sm"
            onFocus={openTimepicker}
          />
          <InputForDateForm
            label="분"
            register={register('minute', { minLength: 2, maxLength: 2 })}
            className="input-datepicker text-sm"
            onFocus={openTimepicker}
            minLength={1}
            maxLength={2}
            step={10}
          />
        </>
      )}
      {hasDatepicker && (
        <div className="absolute left-0 top-8 z-10 bg-white">
          <Datepicker closeAction={closeDatepicker} setDate={setDate} />
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
