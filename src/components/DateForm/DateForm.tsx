import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { cls, getPositionRef } from '../../utils/commonUtils';
import Datepicker from '../Datepicker';
import Timepicker from '../Timepicker';
import { InputForDateForm } from './InputForDateForm';
import FormError from '../FormError';
import Modal from '../Modal';
import { isValidDay, isValidMonth } from '../../utils/dateUtils';
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

export const DateForm = (props: DateFormProps) => {
  const { date, hasHour = false, disablePreviousDay, setParentValue } = props;
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<DateFormFields>({ mode: 'onChange' });

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
  const closeDatepickerAndTimepicker = () => {
    closeDatepicker();
    closeTimepicker();
  };

  const setParentValueAndCloseModal = () => {
    setParentDate();
    closeDatepickerAndTimepicker();
  };

  const setDate = (date: Date) => {
    clearErrors();
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

    if (!isValidMonth(month)) {
      setValue('month', date?.getMonth() || 0);
      return setError('month', {
        message: '1월부터 12월까지 입력할 수 있습니다',
      });
    }

    if (!isValidDay(new Date(year, month - 1), day)) {
      setValue('day', date?.getDate() || 0);
      return setError('day', { message: '없는 날짜입니다' });
    }

    const monthStr = String(month).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');

    const startDate = new Date(
      `${year}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:00`
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

  const getError = () => {
    let message = '';
    const error = Object.values(errors)[0];
    if (error?.message) {
      message = error.message;
    }
    return message;
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const { top, left, right } = getPositionRef(containerRef);

  return (
    <div
      className={cls(
        'relative grid w-full overflow-hidden rounded-md border',
        hasHour
          ? 'grid-cols-[1fr_repeat(4,_0.7fr)]'
          : 'grid-cols-[1fr_repeat(2,_0.7fr)]'
      )}
      onBlur={setParentValueAndCloseModal}
      ref={containerRef}
    >
      <InputForDateForm
        label="년"
        register={register('year', { max: 12, min: 1 })}
        className="date-form__input"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="월"
        register={register('month', { max: 12, min: 1 })}
        className="date-form__input"
        onFocus={openDatepicker}
      />
      <InputForDateForm
        label="일"
        register={register('day', { max: 31, min: 1 })}
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
        <Modal
          closeAction={closeDatepicker}
          isTransparentBackground
          top={top}
          left={left}
        >
          <Datepicker
            closeAction={closeDatepicker}
            selectedDate={date || new Date()}
            selectDate={setDate}
            disablePreviousDay={disablePreviousDay}
          />
        </Modal>
      )}
      {hasTimepicker && (
        <Modal
          closeAction={closeTimepicker}
          isTransparentBackground
          top={top}
          left={right && right - 100}
        >
          <Timepicker closeAction={closeTimepicker} setTime={setTime} />
        </Modal>
      )}
      <FormError error={getError()} top="30px" textAlign="left" />
    </div>
  );
};
