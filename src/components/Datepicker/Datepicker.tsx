import { useEffect, useMemo, useState } from 'react';
import { Calendar as CalendarModel } from '../../models/Calendar';
import { DatepickerContext } from './DatepickerStore';
import { DatepickerNavigation } from './DatepickerNavigation';
import { DatepickerMain } from './DatepickerMain';
import { DatepickerButtons } from './DatepickerButtons';
import { DatepickerProps } from '../../types/propsTypes';

export const Datepicker = ({
  closeAction,
  selectedDate,
  selectDate,
  disablePreviousDay,
}: DatepickerProps) => {
  const calendar = useMemo(
    () => new CalendarModel(selectedDate),
    [selectedDate]
  );

  const [month, setMonth] = useState(calendar.month);

  const getYearMonth = () => {
    return calendar.toStringYearMonth();
  };

  const setPreviousMonth = () => {
    setMonth(calendar.setToPreviousMonth().month);
  };

  const setNextMonth = () => {
    setMonth(calendar.setToNextMonth().month);
  };

  const value = useMemo(
    () => ({
      month,
      getYearMonth,
      setPreviousMonth,
      setNextMonth,
      closeAction,
      selectedDate,
      selectDate,
    }),
    [month, selectedDate]
  );

  useEffect(() => {
    setMonth(calendar.month);
  }, [calendar]);

  return (
    <DatepickerContext.Provider value={value}>
      <div className="datepicker__calendar-body z-50 min-w-[240px] max-w-[440px]">
        <div className="flex w-full flex-col rounded-md border bg-white p-3">
          <DatepickerNavigation />
          <DatepickerMain disablePreviousDay={disablePreviousDay} />
          <DatepickerButtons />
        </div>
      </div>
    </DatepickerContext.Provider>
  );
};
