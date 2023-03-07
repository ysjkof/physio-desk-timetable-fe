import { endOfYesterday } from 'date-fns';
import { useContext } from 'react';
import { CalendarDate } from '../../models/CalendarDate';
import { cls } from '../../utils/commonUtils';
import { compareDateMatch, isBeforeDateB } from '../../utils/dateUtils';
import { DatepickerContext } from './DatepickerStore';

interface DatepickerMainProps {
  disablePreviousDay: boolean | undefined;
}

export const DatepickerMain = ({ disablePreviousDay }: DatepickerMainProps) => {
  const { month } = useContext(DatepickerContext);

  return (
    <div className="flex">
      <div className="grid w-full grid-cols-[repeat(7,30px)] justify-between pr-1.5 text-center text-sm">
        <Title />
        {month.map((day) => {
          const isActive = disablePreviousDay
            ? !isBeforeDateB(endOfYesterday(), day.getDate())
            : true;
          return (
            <CalendarDay
              isActive={isActive}
              key={day.getDate().valueOf()}
              date={day}
            />
          );
        })}
      </div>
    </div>
  );
};

const Title = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return (
    <>
      {days.map((day, index) => (
        <div
          key={`datepicker__calendar-day${day}`}
          className={cls(
            'mx-1 mb-2 w-full font-medium',
            index === 0 ? 'sunday' : '',
            index === 6 ? 'saturday' : ''
          )}
        >
          {day}
        </div>
      ))}
    </>
  );
};

interface CalendarDayProps {
  date: CalendarDate;
  isActive: boolean;
}

const CalendarDay = ({ date, isActive }: CalendarDayProps) => {
  const { selectedDate, selectDate, closeAction } =
    useContext(DatepickerContext);

  const isSelect = compareDateMatch(date.getDate(), selectedDate, 'ymd');

  const selectAndClose = () => {
    selectDate(date.getDate());
    closeAction?.();
  };

  return (
    <button
      type="button"
      className={cls(
        'relative m-1 aspect-square w-full cursor-pointer p-1 text-center',
        isActive ? '' : 'pointer-events-none line-through',
        date.isSunday() ? 'sunday' : '',
        date.isSaturday() ? 'saturday' : '',
        date.isThisMonth() ? '' : 'opacity-50',
        isSelect ? 'rounded-full ring-2 ring-blue-500' : ''
      )}
      onClick={selectAndClose}
    >
      {date.getDay()}
      {date.isToday() ? <DotThatRepresentsToday /> : null}
    </button>
  );
};

const DotThatRepresentsToday = () => {
  return (
    <span className="position-center-x absolute bottom-0.5 rounded-full bg-yellow-500 p-0.5 text-xs" />
  );
};
